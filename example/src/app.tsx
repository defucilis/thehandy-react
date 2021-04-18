import React from "react";
import { render } from "react-dom";
import { HandyProvider } from "../../src";
import HandyTest from "./HandyTest";

render(
    <HandyProvider>
        <HandyTest />
    </HandyProvider>,
    document.getElementById("root")
);
