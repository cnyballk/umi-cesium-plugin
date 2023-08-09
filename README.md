# umi-cesium-plugin

[![NPM version](https://img.shields.io/npm/v/umi-cesium-plugin.svg?style=flat)](https://npmjs.org/package/umi-cesium-plugin)
[![NPM downloads](http://img.shields.io/npm/dm/umi-cesium-plugin.svg?style=flat)](https://npmjs.org/package/umi-cesium-plugin)

运行时将 Cesium 的资源请求代理到 node_modules 中，将 css 文件注入到html中，并且自动注册 accessToken ，优先读取项目中的 Cesium 版本，项目未安装再读取本插件的 Cesium ，版本为 1.108.0

构建会将 Cesium 的资源打包至输出文件

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
