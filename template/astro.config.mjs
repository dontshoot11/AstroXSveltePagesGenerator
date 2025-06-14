import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import relativeLinks from "astro-relative-links";
import compress from "astro-compress";
import { customTranslationPlugin } from "astro-x-svelte-static-pages-generator/translationUtils/customTranslationPlugin.mjs";

// https://astro.build/config
export default defineConfig({
  build: {
    assets: "assets",
  },
  integrations: [
    svelte(),
    relativeLinks(),
    compress(),
    customTranslationPlugin(),
  ],
});
