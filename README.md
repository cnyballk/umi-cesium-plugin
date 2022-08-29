# umi-cesium-plugin

[![NPM version](https://img.shields.io/npm/v/umi-cesium-plugin.svg?style=flat)](https://npmjs.org/package/umi-cesium-plugin)
[![NPM downloads](http://img.shields.io/npm/dm/umi-cesium-plugin.svg?style=flat)](https://npmjs.org/package/umi-cesium-plugin)

## Install

```bash
# or yarn
# or pnpm
$ npm install umi-cesium-plugin
```

## Usage

Configure in `.umirc.js`,

```js
export default {
  plugins: ["umi-cesium-plugin"],
  cesium: {
    accessToken: "your accessToken",
  },
};
```

## page/index.ts

```tsx
import { Cesium } from "umi";

// your code...
```

## LICENSE

MIT
