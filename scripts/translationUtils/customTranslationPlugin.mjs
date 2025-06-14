import fs from "fs";
import path from "path";
import { projectRoot } from "astro-x-svelte-static-pages-generator/scripts/utils/findProjectRoot.js";

function loadTranslations() {
  const translationsDir = path.resolve(`${projectRoot}/translations`);
  const langs = {};

  function importLangFiles(dir) {
    if (!fs.existsSync(dir)) {
      console.warn(`[i18n] Directory not found: ${dir}`);
      return;
    }

    fs.readdirSync(dir)
      .filter(
        (file) =>
          file.endsWith(".json") && /^[a-z]{2}(?:_[A-Z]{2})?\.json$/i.test(file)
      )
      .forEach((file) => {
        try {
          const langCode = file
            .replace(/\.json$/, "")
            .split("_")[0]
            .toLowerCase();
          const content = fs.readFileSync(path.join(dir, file), "utf-8");
          langs[langCode] = JSON.parse(content);
        } catch (e) {
          console.error(`[i18n] Error loading ${file}:`, e);
        }
      });
  }

  importLangFiles(translationsDir);
  return langs;
}

export function customTranslationPlugin() {
  let isDev = false;
  const serverKeys = new Set();
  const clientKeys = new Set();
  let translationsCache = null;
  let oldGlobals = globalThis.translations;

  const updateGlobals = () => {
    if (!translationsCache) translationsCache = loadTranslations();

    const result = {
      translations: {},
      clientTranslations: {},
    };

    for (const lang in translationsCache) {
      result.translations[lang] = {};
      result.clientTranslations[lang] = {};

      Array.from(serverKeys).forEach((key) => {
        if (translationsCache[lang][key]) {
          result.translations[lang][key] = translationsCache[lang][key];
        }
      });

      Array.from(clientKeys).forEach((key) => {
        if (translationsCache[lang][key]) {
          result.clientTranslations[lang][key] = translationsCache[lang][key];
        }
      });
    }

    globalThis.translations = result.translations;
    globalThis.clientTranslations = result.clientTranslations;

    if (isDev) {
      if (
        JSON.stringify(oldGlobals) !== JSON.stringify(globalThis.translations)
      ) {
        oldGlobals = JSON.parse(JSON.stringify(globalThis.translations));
        console.log("[i18n] Translations updated", {
          serverKeys: serverKeys.size,
          clientKeys: clientKeys.size,
          timestamp: new Date().toISOString(),
        });
      }
    }
  };

  return {
    name: "custom-translation-plugin",
    hooks: {
      "astro:config:setup": ({ command, updateConfig }) => {
        isDev = command === "dev";
        translationsCache = loadTranslations();
        updateGlobals();

        updateConfig({
          vite: {
            plugins: [
              {
                name: "vite-i18n-collector",
                transform(code, id) {
                  if (shouldSkipFile(id)) return code;

                  const isStaticOnly = /"only:static"|'only:static'/.test(code);
                  if (isStaticOnly) {
                    if (isDev) {
                      console.log(
                        `[i18n] Skipping client keys for static-only file: ${id}`
                      );
                    }

                    const keys = extractKeys(code);
                    keys.forEach((key) => serverKeys.add(key));

                    return code;
                  }

                  const isClient = !id.endsWith(".astro");
                  const keys = extractKeys(code);

                  let hasUpdates = false;
                  keys.forEach((key) => {
                    if (!serverKeys.has(key)) {
                      serverKeys.add(key);
                      hasUpdates = true;
                    }
                    if (isClient && !clientKeys.has(key)) {
                      clientKeys.add(key);
                      hasUpdates = true;
                    }
                  });

                  updateGlobals();

                  return code;
                },
              },
            ],
          },
        });
      },
      "astro:server:setup": ({ server }) => {
        server.middlewares.use((req, _res, next) => {
          updateGlobals();
          if (
            JSON.stringify(oldGlobals) !==
            JSON.stringify(globalThis.translations)
          ) {
            oldGlobals = JSON.parse(JSON.stringify(globalThis.translations));
            server.ws.send({ type: "full-reload" });
          }

          next();
        });
      },
      "astro:server:start": () => {
        updateGlobals();
      },

      "astro:build:setup": () => {
        updateGlobals();
      },
    },
  };
}

function extractKeys(code) {
  const keys = new Set();
  const patterns = [
    /(?:getTranslate|t|i18n\.t)\s*\(\s*["']([a-zA-Z0-9_]+)["']/g,
    /t\.([a-zA-Z0-9_]+)\b/g,
    /i18nKey:\s*["']([a-zA-Z0-9_]+)["']/g,
  ];

  patterns.forEach((regex) => {
    let match;
    while ((match = regex.exec(code))) {
      if (match[1]) keys.add(match[1]);
    }
  });

  return keys;
}

function shouldSkipFile(id) {
  return (
    id.includes("node_modules") ||
    id.includes("virtual:") ||
    id.includes("?") ||
    !/\.(astro|js|ts|jsx|tsx|svelte|vue)$/.test(id)
  );
}
