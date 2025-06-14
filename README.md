# Astro x Svelte Static Pages Generator 🚀

This is a static page generator built with [Astro](https://astro.build/) and [Svelte](https://svelte.dev/), with custom scripts added for convenient multilingual support. 🌍

The project follows the [Astro Islands](https://docs.astro.build/en/concepts/islands/) philosophy: most computations are handled during the build process, producing a clean project with interactive "islands" created with Svelte.

A custom solution is used to support multilingual capabilities.

## 🛠 Getting Started

To start, install packages:

```bash
npm i astro-x-svelte-static-pages-generator@latest
```

Then, install dependencies

```bash
npm i astro-relative-links
```

After installation, a basic project template will be set up. Feel free to modify it as needed; the template is provided for reference.

## 🌐 Localization

In the translations folder of the template project, you’ll find sample JSON files with key-value pairs and helper functions for managing translations.

Create an array strings with language prefixes that you will need.

1. During development, write the [getStaticPaths](https://docs.astro.build/en/reference/routing-reference/#getstaticpaths) function, which will take this array and use it during the iteration to build paths for localized pages. If you don’t need a language prefix for the default text page, add an `undefied` to `getStaticProps` - it will build directories without language prefixies using default language to localize.

`getStaticPaths` example

```Astro
---
import DemoComponent from "@components/DemoComponent/DemoComponent.svelte";
import { getTranslate } from "astro-x-svelte-static-pages-generator";

import Layout from "src/layout/Layout.astro";

export const locales = ["en", "es"];

type PathType = {
  params: {
    locale?: string;
  };
};

export async function getStaticPaths() {
  const allPaths: PathType[] = [];
  allPaths.push({
    params: {
      locale: undefined,
    },
  });
  for (const locale of locales) {
    allPaths.push({
      params: {
        locale: locale,
      },
    });
  }

  return allPaths;
}
---

<Layout title={getTranslate("title", "titleFallback")}>
  <div class="container">
    <h1>{getTranslate("wake_up", "wake up fallback")}</h1>
    <DemoComponent client:only="svelte" />
  </div>
</Layout>

```

2. In a high-level component, such as `Layout`, store Astro.url in a global variable to make it accessible during static site generation.

```Astro
---
globalThis.AstroUrl = Astro.url;
---

```

3. In the same component, add the required translations to a data attribute on the <html> tag so they are available on the client side.

```Astro
---
import { getCurrentLang } from "astro-x-svelte-static-pages-generator";
const currentLang = getCurrentLang();
const translations = globalThis.clientTranslations;
---

<!doctype html>
<html
  lang={currentLang}
  dir={dir}
  data-page-translations={JSON.stringify(translations[currentLang])}
>

```

4. Register the translation plugin in astro.config.mjs to enable localization support.

```mjs
import { defineConfig } from "astro/config";
import { customTranslationPlugin } from "astro-x-svelte-static-pages-generator/translationUtils/customTranslationPlugin.mjs";

export default defineConfig({
  integrations: [customTranslationPlugin()],
});
```

5. To use translations after proper setup, simply call the getTranslate function with the translation key as the first argument and a fallback string as the second argument (used as the default value). You can use the function in any context — it will automatically access the appropriate set of translation keys at runtime.

Using translates:

```Astro
---
import { getTranslate } from "astro-x-svelte-static-pages-generator";
---

<p>{getTranslate('key', 'default value')}</p>

```

⚠️ Note: Due to the rendering behavior of the development server, some translations may not appear correctly on the first load during local development. If you notice any anomalies (e.g. fallback texts showing up despite existing translations), simply reload the page.
This does not affect the production build — all translations are compiled correctly from the start.

## 🧰 Utility Functions

Several helpful functions are included in the project for general use:

### `debounce` ⏱

Limits the number of times a function is called within a specified period. It takes a function as the first argument and a delay as the second. This decorator is useful when you need to reduce the number of function calls, such as during page scroll or resize events.

**Example**: A user types in a field, and `debounce` resets a timer, waiting until typing stops. Once the user finishes (e.g., after 300 ms), the function is triggered.

```javascript
import { debounce } from "astro-x-svelte-static-pages-generator";
const debouncedFunction = debounce(() => console.log("Function call"), 300);
window.addEventListener("resize", debouncedFunction);
```

### `throttle` ⚙️

Another decorator that reduces function call frequency, ensuring the function is called no more than once within a given interval.

**Example**: During scrolling, throttle ensures the function is called once every specified period (e.g., every 200 ms), regardless of the scroll frequency.

```javascript
import { throttle } from "astro-x-svelte-static-pages-generator";
const throttledFunction = throttle(() => console.log("Function call"), 200);
window.addEventListener("resize", throttledFunction);
```

### `getOS` 💻

Returns the operating system based on the user's browser user agent.

Note: This function only works on the client side.

```javascript
import { getOS } from "astro-x-svelte-static-pages-generator";
const OS = getOS();
```

### `getCurrentLang` 🌍

Returns page locale. Works in Astro context, can be passed as data-lang.

```javascript
import { geCurrentLang } from "astro-x-svelte-static-pages-generator";
const currentLang = getCurrentLang();
```

### `checkDate` 📅

Checks if a specified date has passed, returning a boolean.

```javascript
import { checkDate } from "astro-x-svelte-static-pages-generator";
const isMerryChristmas = checkDate("25 December 2025");
```
