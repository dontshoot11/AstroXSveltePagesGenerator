import fs from "fs-extra";
import path from "path";

function findProjectRoot(currentDir) {
  const hasPackageJson = fs.existsSync(path.join(currentDir, "package.json"));
  const hasNodeModules = fs.existsSync(path.join(currentDir, "node_modules"));

  if (hasPackageJson && hasNodeModules) {
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
