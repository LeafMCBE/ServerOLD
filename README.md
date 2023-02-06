# LeafMCBE

A Server Software for Minecraft: Bedrock Edition written in Javascript (With types) with [@PrismarineJS/bedrock-protocol](https://github.com/PrismarineJS/bedrock-protocol). Server Under Development

## Features

- Plugins Supported
- Logger Supported

## Installation

- Clone the repo, `git clone https://github.com/hvlxh/LeafMCBE.git`
- Install dependencies, `npm i`
- Start the server, `node .`, `node start.js`, or `npm run start`

## Plugin Usage

Create a javascript file in `./leaf/plugins` and write like this:

```js
import { Base } from "../../src/plugins/BasePlugin.js";

class Example extends Base {
  constructor() {
    super({
      name: "Example",
      version: [1, 0, 0],
      srvVersion: [1, 19, 50],
    });
  }

  onEnable() {
    console.log("I am enabled!");
  }
}
```

## Todo List

- Convert Packet into JS (not json)
- Add chunk support (maybe)
- Commands System
- Console Command Sender
