<h1 align="center">
  <a href='https://github.com/defucilis/thehandy-react'>TheHandyReact</a> - React utilities for working with The Handy
</h1>

<p align="center">
  <a href='https://www.npmjs.com/package/thehandy'>
      <img src="https://img.shields.io/npm/v/thehandy-react.svg" />
  </a>
  <a href='https://simple.wikipedia.org/wiki/MIT_License'>
      <img src="https://img.shields.io/badge/license-MIT-lightgrey" />
  </a>
  <img src="https://img.shields.io/bundlephobia/minzip/thehandy-react" />
  <img src="https://img.shields.io/npm/dw/thehandy-react" />
</p>

## Installation

```sh
npm i thehandy-react
```

## Getting Started

thehandy uses [React Context](https://reactjs.org/docs/context.html) to ensure that a single instance of the `Handy` class can be accessed by all components. So you'll need to add this provider to the root of your app.

```js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { HandyProvider } from 'thehandy'

ReactDOM.render(
    <HandyProvider>
      <App />
    </HandyProvider>,
  document.getElementById("root")
);

export default App;
```

Now, you can access the device using the `useHandy` hook:

```js
import React from "react";
import { useHandy } from "thehandy";

const App = () => {
  const {handy} = useHandy();
  
  return (
    <p>Connection key is {handy.connectionKey}</p>
    <input onChange={e => handy.connectionKey = e.target.value} />
    <button onClick={() => handy.toggleMode(1)}>Toggle Auto Mode</button>
    <button onClick={() => handy.setSpeed(Math.random() * 100)}>Randomize Speed</button>
  )
}

export default App;
```

## Handy API Reference

See the documentation for my base package [thehandy](https://github.com/defucilis/thehandy) for information on how to send and receive information from a Handy device
