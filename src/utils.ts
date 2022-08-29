import { winPath, resolve } from "umi/plugin-utils";
import { dirname, join } from "path";
export function resolveProjectDep(opts: {
  pkg: any;
  cwd: string;
  dep: string;
}) {
  if (
    opts.pkg.dependencies?.[opts.dep] ||
    opts.pkg.devDependencies?.[opts.dep]
  ) {
    return dirname(
      resolve.sync(`${opts.dep}/package.json`, {
        basedir: opts.cwd,
      })
    );
  }
}
export function getAbsPath(pathA: string, pathB: string) {
  const pathAs = winPath(pathA).split("/");
  const pathBs = winPath(pathB).split("/");
  for (let i = 0; i < pathAs.length; i++) {
    if (pathAs[i] !== pathBs[i]) {
      let absPath = "";
      for (let j = 0; j < pathAs.length - i; j++) {
        absPath += "../";
      }
      return join(absPath, pathBs.slice(i).join("/"));
    }
  }
  return "./" + pathBs.slice(pathAs.length).join("/");
}
