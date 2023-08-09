import { readFileSync } from "fs";
import { dirname, join } from "path";
import type { IApi } from "umi";
import { getAbsPath, resolveProjectDep } from "./utils";

export default (api: IApi) => {
  api.describe({
    key: "cesium",
    config: {
      schema(joi) {
        return joi.object({
          accessToken: joi.string(),
        });
      },
    },
    enableBy: api.EnableBy.config,
  });

  api.onStart(() => {
    api.logger.info("Using cesium Plugin");
  });

  const pkgPath =
    resolveProjectDep({
      pkg: api.pkg,
      cwd: api.cwd,
      dep: "cesium",
    }) || dirname(require.resolve("cesium/package.json"));

  api.modifyConfig((memo) => {
    memo.alias["cesium"] = pkgPath;
    return memo;
  });

  api.modifyAppData((memo) => {
    const version = require(`${pkgPath}/package.json`).version;
    memo.cesium = {
      pkgPath,
      version,
    };
    return memo;
  });
  const cesiumPath = dirname(pkgPath);

  api.addBeforeMiddlewares(() => {
    return [
      (req, res, next) => {
        const { path } = req;
        if (path.startsWith("/Cesium/")) {
          return res.sendFile(join(cesiumPath, "Build", path));
        }
        return next();
      },
    ];
  });

  api.modifyConfig({
    fn: (config) => {
      return api.env === "production"
        ? {
            ...config,
            copy: [
              ...(config.copy || []),
              ...["Workers", "ThirdParty", "Assets", "Widgets"].map((dir) => ({
                from: join(
                  getAbsPath(api.cwd, cesiumPath),
                  "Build/Cesium",
                  dir
                ),
                to: join(config.outputPath || "dist", "Cesium", dir),
              })),
            ],
          }
        : config;
    },
    stage: Infinity,
  });

  api.addHTMLStyles(() => [
    {
      content: readFileSync(
        join(cesiumPath, "Build/Cesium/Widgets/widgets.css"),
        "utf-8"
      ),
    },
  ]);

  api.onGenerateFiles({
    name: "cesium",
    fn: () => {
      // index.ts for export
      api.writeTmpFile({
        path: "index.ts",
        content: `
import * as Cesium from 'cesium';

window.CESIUM_BASE_URL = '/Cesium';
${
  api.config.cesium.accessToken
    ? `Cesium.Ion.defaultAccessToken = '${api.config.cesium.accessToken}';`
    : ""
}

export { Cesium };
`,
      });

      api.writeTmpFile({
        path: 'types.d.ts',
        content: readFileSync(join(cesiumPath, '/Source/Cesium.d.ts'), 'utf-8'),
      });
    },
  });
};
