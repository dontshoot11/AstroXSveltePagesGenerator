import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import relativeLinks from "astro-relative-links";
// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), relativeLinks()],
});
