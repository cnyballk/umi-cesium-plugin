var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var import_plugin_utils = require("umi/plugin-utils");
var import_fs = require("fs");
var import_path = require("path");
var import_utils = require("./utils");
var src_default = (api) => {
  api.describe({
    key: "cesium",
    config: {
      schema(joi) {
        return joi.object({
          accessToken: joi.string()
        });
      }
    },
    enableBy: api.EnableBy.config
  });
  api.onStart(() => {
    api.logger.info("Using cesium Plugin");
  });
  const pkgPath = (0, import_utils.resolveProjectDep)({
    pkg: api.pkg,
    cwd: api.cwd,
    dep: "cesium"
  }) || (0, import_path.dirname)(require.resolve("cesium/package.json"));
  api.modifyConfig((memo) => {
    memo.alias["cesium"] = pkgPath;
    return memo;
  });
  api.modifyAppData((memo) => {
    const version = require(`${pkgPath}/package.json`).version;
    memo.cesium = {
      pkgPath,
      version
    };
    return memo;
  });
  const cesiumPath = (0, import_path.dirname)(require.resolve("cesium"));
  api.addBeforeMiddlewares(() => {
    return [
      (req, res, next) => {
        const { path } = req;
        if (path.startsWith("/Cesium/")) {
          return res.sendFile((0, import_path.join)(cesiumPath, "Build", path));
        }
        return next();
      }
    ];
  });
  api.modifyConfig({
    fn: (config) => {
      return api.env === "production" ? {
        ...config,
        copy: [
          ...config.copy || [],
          ...["Workers", "ThirdParty", "Assets", "Widgets"].map((dir) => ({
            from: (0, import_path.join)((0, import_utils.getAbsPath)(api.cwd, cesiumPath), "Build/Cesium", dir),
            to: (0, import_path.join)(config.outputPath || "dist", "Cesium", dir)
          }))
        ]
      } : config;
    },
    stage: Infinity
  });
  api.addHTMLStyles(() => [
    {
      content: (0, import_fs.readFileSync)((0, import_path.join)(cesiumPath, "Build/Cesium/Widgets/widgets.css"), "utf-8")
    }
  ]);
  api.onGenerateFiles({
    name: "cesium",
    fn: () => {
      api.writeTmpFile({
        path: "index.ts",
        content: `
import * as Cesium from '${(0, import_plugin_utils.winPath)(pkgPath)}';

window.CESIUM_BASE_URL = '/Cesium';
${api.config.cesium.accessToken ? `Cesium.Ion.defaultAccessToken = '${api.config.cesium.accessToken}';` : ""}

export { Cesium };
`
      });
      api.writeTmpFile({
        path: "types.d.ts",
        content: (0, import_fs.readFileSync)((0, import_path.join)(cesiumPath, "/Source/Cesium.d.ts"), "utf-8")
      });
    }
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
