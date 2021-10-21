import React, { useState } from "react";
import { HandyMode } from "thehandy/lib/types";
import useHandy from "../../src";

const HandyTest = () => {
    const {
        connectionKey,
        connect,
        getInfo,
        sendMode,
        sendHampStart,
        sendHampStop,
        sendHampVelocity,
    } = useHandy();
    const [versionResponse, setVersionResponse] = useState("");

    return (
        <div>
            <p>Connection key is {connectionKey}</p>
            <label htmlFor="connectionKey">Set Connection Key </label>
            <input onChange={e => connect(e.target.value)} />
            <br />
            <br />
            <button
                onClick={() =>
                    getInfo().then(response =>
                        setVersionResponse(JSON.stringify(response, null, 2))
                    )
                }
            >
                Get Machine Info
            </button>
            <br />
            <textarea disabled={true} rows={8} cols={32}>
                {versionResponse}
            </textarea>
            <br />
            <br />
            <button onClick={() => sendMode(HandyMode.hamp)}>Set HAMP Mode</button>
            <br />
            <br />
            <button onClick={() => sendHampStart()}>HAMP Start</button>
            <br />
            <br />
            <button onClick={() => sendHampStop()}>HAMP Stop</button>
            <br />
            <br />
            <button onClick={() => sendHampVelocity(Math.random() * 100)}>Randomize Speed</button>
        </div>
    );
};

export default HandyTest;
