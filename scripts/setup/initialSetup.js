import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { projectRoot } from "astro-x-svelte-static-pages-generator/scripts/utils/findProjectRoot.js";
import { copyFileWithLog } from "astro-x-svelte-static-pages-generator/scripts/utils/copyFileWithLog.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setTemplates(rootPath) {
  const templatesDirectory = path.join(__dirname, "../../template");
  const targetDirectory = path.resolve(__dirname, rootPath);

  const projectPackagePath = path.join(targetDirectory, "package.json");
  let projectPackage = {};
  if (await fs.exists(projectPackagePath)) {
    projectPackage = JSON.parse(await fs.readFile(projectPackagePath, "utf8"));
  }

  projectPackage.scripts = projectPackage.scripts || {};
  Object.assign(projectPackage.scripts, {
    start: "npx astro dev",
    build: "npx astro build",
  });

  await fs.writeFile(
    projectPackagePath,
    JSON.stringify(projectPackage, null, 2)
  );

  const filesToCopy = [
    { source: ".gitignore-template", dest: ".gitignore" },
    { source: "astro.config.mjs", dest: "astro.config.mjs" },
    { source: "types.d.ts", dest: "types.d.ts" },
    { source: "../README.md", dest: "README.md" },
    { source: "src_project", dest: "src" },
    { source: "tsconfig-template", dest: "tsconfig.json" },
    { source: "public", dest: "public" },
  ];

  console.log("Minimalistic set up");

  for (const file of filesToCopy) {
    const sourcePath = path.join(templatesDirectory, file.source);
    const destPath = path.join(targetDirectory, file.dest);
    if (!(await fs.exists(destPath))) {
      await copyFileWithLog(sourcePath, destPath);
    }
  }
}

setTemplates(projectRoot)
  .then(() => console.log("Templates set successfully"))
  .catch((error) => console.error("Error setting templates:", error));
