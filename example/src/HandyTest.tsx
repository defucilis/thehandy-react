import React, { useState } from "react";
import useHandy from "../../src/HandyReact";

const HandyTest = () => {
    const { handy } = useHandy();
    const [versionResponse, setVersionResponse] = useState("");

    return (
        <div>
            <p>Connection key is {handy.connectionKey}</p>
            <label htmlFor="connectionKey">Set Connection Key </label>
            <input onChange={e => (handy.connectionKey = e.target.value)} />
            <br />
            <br />
            <button
                onClick={() =>
                    handy
                        .getVersion()
                        .then(response => setVersionResponse(JSON.stringify(response, null, 2)))
                }
            >
                Get Firmware Version
            </button>
            <br />
            <textarea disabled={true} rows={8} cols={32}>
                {versionResponse}
            </textarea>
            <br />
            <br />
            <button onClick={() => handy.toggleMode(1)}>Toggle Auto Mode</button>
            <br />
            <br />
            <button onClick={() => handy.setSpeed(Math.random() * 100)}>Randomize Speed</button>
        </div>
    );
};

export default HandyTest;
