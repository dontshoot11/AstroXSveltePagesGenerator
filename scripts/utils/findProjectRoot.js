import fs from "fs";
import path from "path";

function isRootPackage(dir) {
  const packageJsonPath = path.join(dir, "package.json");
  const nodeModulesPath = path.join(dir, "node_modules");

  if (fs.existsSync(packageJsonPath) && fs.existsSync(nodeModulesPath)) {
    if (dir.includes("astro-x-svelte-static-pages-generator")) {
      return false;
    }

    const parentNodeModulesPath = path.dirname(nodeModulesPath);
    return parentNodeModulesPath === dir;
  }

  return false;
}

function findProjectRoot(currentDir) {
  if (isRootPackage(currentDir)) {
    return currentDir;
  }

  const parentDir = path.dirname(currentDir);

  if (parentDir === currentDir) {
    if (process.env.INIT_CWD) {
      return process.env.INIT_CWD;
    }
    throw new Error("Root folder not found");
  }

  return findProjectRoot(parentDir);
}

export const projectRoot = findProjectRoot(
  new URL(".", import.meta.url).pathname
);
