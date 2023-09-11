"use strict";
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
        ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              Object.defineProperty(o, k2, {
                  enumerable: true,
                  get: function () {
                      return m[k];
                  },
              });
          }
        : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              o[k2] = m[k];
          });
var __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
        ? function (o, v) {
              Object.defineProperty(o, "default", { enumerable: true, value: v });
          }
        : function (o, v) {
              o["default"] = v;
          });
var __importStar =
    (this && this.__importStar) ||
    function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetModeResult = exports.SetHdspResult = exports.SetHampStateResult = exports.HsspSetupResult = exports.HandyFirmwareStatus = exports.GenericResult = exports.HsspState = exports.HandyMode = exports.HampState = exports.HandyProvider = void 0;
const react_1 = __importStar(require("react"));
const thehandy_1 = require("thehandy");
Object.defineProperty(exports, "HampState", {
    enumerable: true,
    get: function () {
        return thehandy_1.HampState;
    },
});
Object.defineProperty(exports, "HandyMode", {
    enumerable: true,
    get: function () {
        return thehandy_1.HandyMode;
    },
});
Object.defineProperty(exports, "HsspState", {
    enumerable: true,
    get: function () {
        return thehandy_1.HsspState;
    },
});
Object.defineProperty(exports, "GenericResult", {
    enumerable: true,
    get: function () {
        return thehandy_1.GenericResult;
    },
});
Object.defineProperty(exports, "HandyFirmwareStatus", {
    enumerable: true,
    get: function () {
        return thehandy_1.HandyFirmwareStatus;
    },
});
Object.defineProperty(exports, "HsspSetupResult", {
    enumerable: true,
    get: function () {
        return thehandy_1.HsspSetupResult;
    },
});
Object.defineProperty(exports, "SetHampStateResult", {
    enumerable: true,
    get: function () {
        return thehandy_1.SetHampStateResult;
    },
});
Object.defineProperty(exports, "SetHdspResult", {
    enumerable: true,
    get: function () {
        return thehandy_1.SetHdspResult;
    },
});
Object.defineProperty(exports, "SetModeResult", {
    enumerable: true,
    get: function () {
        return thehandy_1.SetModeResult;
    },
});
const thehandy_2 = __importDefault(require("thehandy"));
const reactHandyContext = react_1.createContext(null);
/** Context provider for the Handy - wrap your app in it! */
const HandyProvider = ({ verbose, children }) => {
    const reactContext = useHandyReact(verbose);
    return react_1.default.createElement(
        reactHandyContext.Provider,
        { value: reactContext },
        children
    );
};
exports.HandyProvider = HandyProvider;
const useHandy = () => {
    const context = react_1.useContext(reactHandyContext);
    if (!context)
        throw new Error(
            "For some reason, Handy context isn't initialized! This shouldn't happen..."
        );
    return context;
};
/** Context consumer for the Handy provider. Provides access to the Handy and its internal state. */
const useHandyReact = verbose => {
    const [handy] = react_1.useState(new thehandy_2.default(!!verbose));
    const [error, setError] = react_1.useState("");
    const [loading, setLoading] = react_1.useState(false);
    const [connectionKey, setConnectionKey] = react_1.useState("");
    const [handyState, setHandyState] = react_1.useState({
        connected: false,
        info: undefined,
        currentMode: thehandy_1.HandyMode.unknown,
        hampState: thehandy_1.HampState.stopped,
        hampVelocity: 0,
        hdspPosition: 0,
        hsspState: thehandy_1.HsspState.needSetup,
        hsspLoop: false,
        hsspPreparedUrl: "",
        hstpTime: 0,
        hstpOffset: 0,
        hstpRtd: 0,
        estimatedServerTimeOffset: 0,
        slideMin: 0,
        slideMax: 0,
        slidePositionAbsolute: 0,
    });
    const refresh = react_1.useCallback(
        () =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return;
                }
                setConnectionKey(handy.connectionKey);
                //get firmware info and such
                yield getInfo();
                //get slide settings
                yield getSettings();
                //get mode and status
                const { mode } = yield getStatus();
                if (mode === thehandy_1.HandyMode.hamp) {
                    //get hamp-specific stuff
                    yield getHampVelocity();
                } else if (mode === thehandy_1.HandyMode.hssp) {
                    //get hssp specific stuff
                    yield getHsspLoop();
                    yield getHstpOffset();
                    yield getHstpRtd();
                }
                //get round trip delay
                //await getHstpRtd();
                //get timing offset
                //await getHstpOffset();
            }),
        [handy]
    );
    const getMode = react_1.useCallback(
        () =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return handyState.currentMode;
                }
                setLoading(true);
                try {
                    const result = yield handy.getMode();
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            currentMode: result,
                            connected: true,
                        })
                    );
                    setLoading(false);
                    return result;
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
                return handyState.currentMode;
            }),
        [handy, handyState.currentMode]
    );
    const sendMode = react_1.useCallback(
        mode =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return;
                }
                setLoading(true);
                try {
                    yield handy.setMode(mode);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            currentMode: mode,
                            connected: true,
                        })
                    );
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
            }),
        [handy]
    );
    const getConnected = react_1.useCallback(
        () =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return false;
                }
                try {
                    const result = yield handy.getConnected();
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: result })
                    );
                    return true;
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                    return handy.connected;
                }
            }),
        [handy]
    );
    const connect = react_1.useCallback(
        connectionKey =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return false;
                }
                handy.connectionKey = connectionKey;
                setConnectionKey(connectionKey);
                return yield getConnected();
            }),
        [handy, getConnected]
    );
    const disconnect = react_1.useCallback(
        () =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return;
                }
                handy.connectionKey = "";
                setConnectionKey("");
                setHandyState(cur => Object.assign(Object.assign({}, cur), { connected: false }));
            }),
        [handy, getConnected]
    );
    const getInfo = react_1.useCallback(
        () =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return handyState.info;
                }
                setLoading(true);
                try {
                    const result = yield handy.getInfo();
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { info: result, connected: true })
                    );
                    setLoading(false);
                    return result;
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
                return handyState.info;
            }),
        [handy, handyState.info]
    );
    const getSettings = react_1.useCallback(
        () =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return {
                        slideMin: handyState.slideMin,
                        slideMax: handyState.slideMax,
                    };
                }
                setLoading(true);
                try {
                    const result = yield handy.getSettings();
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            slideMin: result.slideMin,
                            slideMax: result.slideMax,
                            connected: true,
                        })
                    );
                    setLoading(false);
                    return result;
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
                return {
                    slideMin: handyState.slideMin,
                    slideMax: handyState.slideMax,
                };
            }),
        [handy, handyState.slideMin, handyState.slideMax]
    );
    const getStatus = react_1.useCallback(
        () =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return {
                        mode: handyState.currentMode,
                        state:
                            handyState.currentMode === thehandy_1.HandyMode.hamp
                                ? handyState.hampState
                                : handyState.currentMode === thehandy_1.HandyMode.hssp
                                ? handyState.hsspState
                                : 0,
                    };
                }
                setLoading(true);
                try {
                    const result = yield handy.getStatus();
                    if (result.mode === thehandy_1.HandyMode.hamp) {
                        setHandyState(cur =>
                            Object.assign(Object.assign({}, cur), {
                                currentMode: result.mode,
                                hampState: result.state,
                                connected: true,
                            })
                        );
                    } else if (result.mode === thehandy_1.HandyMode.hssp) {
                        setHandyState(cur =>
                            Object.assign(Object.assign({}, cur), {
                                currentMode: result.mode,
                                hsspState: result.state,
                                connected: true,
                            })
                        );
                    } else {
                        setHandyState(cur =>
                            Object.assign(Object.assign({}, cur), {
                                currentMode: result.mode,
                                connected: true,
                            })
                        );
                    }
                    setLoading(false);
                    return result;
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
                return {
                    mode: handyState.currentMode,
                    state:
                        handyState.currentMode === thehandy_1.HandyMode.hamp
                            ? handyState.hampState
                            : handyState.currentMode === thehandy_1.HandyMode.hssp
                            ? handyState.hsspState
                            : 0,
                };
            }),
        [handy, handyState.currentMode, handyState.hampState, handyState.hsspState]
    );
    const sendHampStart = react_1.useCallback(
        () =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return;
                }
                setLoading(true);
                try {
                    yield handy.setHampStart();
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            hampState: thehandy_1.HampState.moving,
                            connected: true,
                        })
                    );
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            currentMode: thehandy_1.HandyMode.hamp,
                            connected: handy.connected,
                        })
                    );
                }
                setLoading(false);
            }),
        [handy]
    );
    const sendHampStop = react_1.useCallback(
        () =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return;
                }
                setLoading(true);
                try {
                    yield handy.setHampStop();
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            hampState: thehandy_1.HampState.stopped,
                            connected: true,
                        })
                    );
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            currentMode: thehandy_1.HandyMode.hamp,
                            connected: handy.connected,
                        })
                    );
                }
                setLoading(false);
            }),
        [handy]
    );
    const sendHampState = react_1.useCallback(
        state =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (state === thehandy_1.HampState.moving) {
                    yield sendHampStart();
                } else {
                    yield sendHampStop();
                }
            }),
        [handy, sendHampStart, sendHampStop]
    );
    const getHampState = react_1.useCallback(
        () =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return handyState.hampState;
                }
                setLoading(true);
                try {
                    const result = yield handy.getHampState();
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            hampState: result.state,
                            connected: true,
                        })
                    );
                    setLoading(false);
                    return result.state;
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            currentMode: thehandy_1.HandyMode.hamp,
                            connected: handy.connected,
                        })
                    );
                }
                setLoading(false);
                return handyState.hampState;
            }),
        [handy, handyState.hampState]
    );
    const getHampVelocity = react_1.useCallback(
        () =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return handyState.hampVelocity;
                }
                setLoading(true);
                try {
                    const result = yield handy.getHampVelocity();
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            currentMode: thehandy_1.HandyMode.hamp,
                            hampVelocity: result,
                            connected: true,
                        })
                    );
                    setLoading(false);
                    return result;
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
                return handyState.hampVelocity;
            }),
        [handy, handyState.hampVelocity]
    );
    const sendHampVelocity = react_1.useCallback(
        velocity =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return;
                }
                setError("");
                setLoading(true);
                try {
                    yield handy.setHampVelocity(velocity);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            currentMode: thehandy_1.HandyMode.hamp,
                            hampVelocity: velocity,
                            connected: true,
                        })
                    );
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
            }),
        [handy]
    );
    const sendHdspXaVa = react_1.useCallback(
        (positionAbsolute, velocityAbsolute, stopOnTarget) =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return;
                }
                setLoading(true);
                try {
                    yield handy.setHdspXaVa(positionAbsolute, velocityAbsolute, stopOnTarget);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            currentMode: thehandy_1.HandyMode.hdsp,
                            connected: true,
                        })
                    );
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
            }),
        [handy]
    );
    const sendHdspXpVa = react_1.useCallback(
        (positionPercentage, velocityAbsolute, stopOnTarget) =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return;
                }
                setLoading(true);
                try {
                    yield handy.setHdspXpVa(positionPercentage, velocityAbsolute, stopOnTarget);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            currentMode: thehandy_1.HandyMode.hdsp,
                            connected: true,
                        })
                    );
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
            }),
        [handy]
    );
    const sendHdspXpVp = react_1.useCallback(
        (positionPercentage, velocityPercentage, stopOnTarget) =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return;
                }
                setLoading(true);
                try {
                    yield handy.setHdspXpVp(positionPercentage, velocityPercentage, stopOnTarget);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            currentMode: thehandy_1.HandyMode.hdsp,
                            connected: true,
                        })
                    );
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
            }),
        [handy]
    );
    const sendHdspXaT = react_1.useCallback(
        (positionAbsolute, durationMilliseconds, stopOnTarget) =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return;
                }
                setLoading(true);
                try {
                    yield handy.setHdspXaT(positionAbsolute, durationMilliseconds, stopOnTarget);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            currentMode: thehandy_1.HandyMode.hdsp,
                            connected: true,
                        })
                    );
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
            }),
        [handy]
    );
    const sendHdspXpT = react_1.useCallback(
        (positionPercentage, durationMilliseconds, stopOnTarget) =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return;
                }
                setLoading(true);
                try {
                    yield handy.setHdspXpT(positionPercentage, durationMilliseconds, stopOnTarget);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            currentMode: thehandy_1.HandyMode.hdsp,
                            connected: true,
                        })
                    );
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
            }),
        [handy]
    );
    const sendHsspPlay = react_1.useCallback(
        (playbackPosition, serverTime) =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return;
                }
                setLoading(true);
                try {
                    yield handy.setHsspPlay(playbackPosition, serverTime);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            currentMode: thehandy_1.HandyMode.hssp,
                            hsspState: thehandy_1.HsspState.playing,
                            connected: true,
                        })
                    );
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
            }),
        [handy]
    );
    const sendHsspStop = react_1.useCallback(
        () =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return;
                }
                setLoading(true);
                try {
                    yield handy.setHsspStop();
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            currentMode: thehandy_1.HandyMode.hssp,
                            hsspState: thehandy_1.HsspState.stopped,
                            connected: true,
                        })
                    );
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
            }),
        [handy]
    );
    const sendHsspSetup = react_1.useCallback(
        (url, sha256) =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return;
                }
                setLoading(true);
                try {
                    yield handy.setHsspSetup(url, sha256);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            currentMode: thehandy_1.HandyMode.hssp,
                            hsspState: thehandy_1.HsspState.stopped,
                            connected: true,
                        })
                    );
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
            }),
        [handy]
    );
    const getHsspLoop = react_1.useCallback(
        () =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return handyState.hsspLoop;
                }
                setLoading(true);
                try {
                    const result = yield handy.getHsspLoop();
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            currentMode: thehandy_1.HandyMode.hssp,
                            hsspLoop: result,
                            connected: true,
                        })
                    );
                    setLoading(false);
                    return result;
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
                return handyState.hsspLoop;
            }),
        [handy, handyState.hsspLoop]
    );
    const sendHsspLoop = react_1.useCallback(
        loop =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return;
                }
                setLoading(true);
                try {
                    yield handy.setHsspLoop(loop);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            currentMode: thehandy_1.HandyMode.hssp,
                            hsspLoop: loop,
                            connected: true,
                        })
                    );
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
            }),
        [handy]
    );
    const getHsspState = react_1.useCallback(
        () =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return handyState.hsspState;
                }
                setLoading(true);
                try {
                    const result = yield handy.getHsspState();
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            currentMode: thehandy_1.HandyMode.hssp,
                            hsspState: result,
                            connected: true,
                        })
                    );
                    setLoading(false);
                    return result;
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
                return handyState.hsspState;
            }),
        [handy, handyState.hsspState]
    );
    const getHstpTime = react_1.useCallback(
        () =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return handyState.hstpTime;
                }
                setLoading(true);
                try {
                    const result = yield handy.getHstpTime();
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { hstpTime: result, connected: true })
                    );
                    setLoading(false);
                    return result;
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
                return handyState.hstpTime;
            }),
        [handy, handyState.hstpTime]
    );
    const getHstpOffset = react_1.useCallback(
        () =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return handyState.hstpOffset;
                }
                setLoading(true);
                try {
                    const result = yield handy.getHstpOffset();
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            hstpOffset: result,
                            connected: true,
                        })
                    );
                    setLoading(false);
                    return result;
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
                return handyState.hstpOffset;
            }),
        [handy, handyState.hstpOffset]
    );
    const sendHstpOffset = react_1.useCallback(
        offset =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return;
                }
                setLoading(true);
                try {
                    yield handy.setHstpOffset(offset);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            hstpOffset: offset,
                            connected: true,
                        })
                    );
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
            }),
        [handy]
    );
    const getHstpRtd = react_1.useCallback(
        () =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return handyState.hstpRtd;
                }
                setLoading(true);
                try {
                    const result = yield handy.getHstpRtd();
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { hstpRtd: result, connected: true })
                    );
                    setLoading(false);
                    return result;
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
                return handyState.hstpRtd;
            }),
        [handy, handyState.hstpRtd]
    );
    const getHstpSync = react_1.useCallback(
        (syncCount = 30, outliers = 6) =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return {
                        rtd: handyState.hstpRtd,
                        time: 0,
                    };
                }
                setLoading(true);
                try {
                    const result = yield handy.getHstpSync(syncCount, outliers);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            hstpRtd: result.rtd,
                            connected: true,
                        })
                    );
                    setLoading(false);
                    return result;
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
                return {
                    rtd: handyState.hstpRtd,
                    time: 0,
                };
            }),
        [handy, handyState.hstpRtd]
    );
    const getSlideSettings = react_1.useCallback(
        () =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return {
                        min: handyState.slideMin,
                        max: handyState.slideMax,
                    };
                }
                setLoading(true);
                try {
                    const result = yield handy.getSlideSettings();
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            slideMin: result.min,
                            slideMax: result.max,
                            connected: true,
                        })
                    );
                    setLoading(false);
                    return result;
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
                return {
                    min: handyState.slideMin,
                    max: handyState.slideMax,
                };
            }),
        [handy, handyState.slideMin, handyState.slideMax]
    );
    const getSlidePositionAbsolute = react_1.useCallback(
        () =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return handyState.slidePositionAbsolute;
                }
                setLoading(true);
                try {
                    const result = yield handy.getSlidePositionAbsolute();
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            slidePositionAbsolute: result,
                            connected: true,
                        })
                    );
                    setLoading(false);
                    return result;
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
                return handyState.slidePositionAbsolute;
            }),
        [handy, handyState.slidePositionAbsolute]
    );
    const sendSlideSettings = react_1.useCallback(
        (min, max) =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return;
                }
                setLoading(true);
                try {
                    yield handy.setSlideSettings(min, max);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            slideMin: min,
                            slideMax: max,
                            connected: true,
                        })
                    );
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
            }),
        [handy]
    );
    const sendSlideMin = react_1.useCallback(
        (min, fixed = false) =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return;
                }
                setLoading(true);
                try {
                    yield handy.setSlideMin(min);
                    if (fixed) {
                        const offset = min - handyState.slideMin;
                        const newMax = Math.max(0, Math.min(100, handyState.slideMax + offset));
                        setHandyState(cur =>
                            Object.assign(Object.assign({}, cur), {
                                slideMin: min,
                                slideMax: newMax,
                                connected: true,
                            })
                        );
                    } else {
                        setHandyState(cur =>
                            Object.assign(Object.assign({}, cur), {
                                slideMin: min,
                                connected: true,
                            })
                        );
                    }
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
            }),
        [handy, handyState.slideMin, handyState.slideMax]
    );
    const sendSlideMax = react_1.useCallback(
        (max, fixed = false) =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return;
                }
                setLoading(true);
                try {
                    yield handy.setSlideMax(max);
                    if (fixed) {
                        const offset = max - handyState.slideMax;
                        const newMin = Math.max(0, Math.min(100, handyState.slideMin + offset));
                        setHandyState(cur =>
                            Object.assign(Object.assign({}, cur), {
                                slideMax: max,
                                slideMin: newMin,
                                connected: true,
                            })
                        );
                    } else {
                        setHandyState(cur =>
                            Object.assign(Object.assign({}, cur), {
                                slideMax: max,
                                connected: true,
                            })
                        );
                    }
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
            }),
        [handy, handyState.slideMin, handyState.slideMax]
    );
    const getServerTimeOffset = react_1.useCallback(
        (trips = 30, onProgress) =>
            __awaiter(void 0, void 0, void 0, function* () {
                setError("");
                if (!handy) {
                    setError("Handy not initialized");
                    return handyState.estimatedServerTimeOffset;
                }
                setLoading(true);
                try {
                    const result = yield handy.getServerTimeOffset(trips, onProgress);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), {
                            estimatedServerTimeOffset: result,
                            connected: true,
                        })
                    );
                    setLoading(false);
                    return result;
                } catch (error) {
                    setError(error.message);
                    setHandyState(cur =>
                        Object.assign(Object.assign({}, cur), { connected: handy.connected })
                    );
                }
                setLoading(false);
                return handyState.estimatedServerTimeOffset;
            }),
        [handy, handyState.estimatedServerTimeOffset]
    );
    return {
        error,
        loading,
        handyState,
        refresh,
        connect,
        disconnect,
        connectionKey,
        getMode,
        sendMode,
        getConnected,
        getInfo,
        getSettings,
        getStatus,
        sendHampStart,
        sendHampStop,
        sendHampState,
        getHampState,
        getHampVelocity,
        sendHampVelocity,
        sendHdspXaVa,
        sendHdspXpVa,
        sendHdspXpVp,
        sendHdspXaT,
        sendHdspXpT,
        sendHsspPlay,
        sendHsspStop,
        sendHsspSetup,
        getHsspLoop,
        sendHsspLoop,
        getHsspState,
        getHstpTime,
        getHstpOffset,
        sendHstpOffset,
        getHstpRtd,
        getHstpSync,
        getSlideSettings,
        getSlidePositionAbsolute,
        sendSlideSettings,
        sendSlideMin,
        sendSlideMax,
        getServerTimeOffset,
    };
};
exports.default = useHandy;
//# sourceMappingURL=index.js.map
