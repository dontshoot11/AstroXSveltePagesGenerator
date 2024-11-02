# Astro x Svelte Static Pages Generator

This is a static page generator built with [Astro](https://astro.build/) and [Svelte](https://svelte.dev/), with custom scripts added for convenient multilingual support.

The project follows the [Astro Islands](https://docs.astro.build/en/concepts/islands/) philosophy: most computations are handled during the build process, producing a clean project with interactive "islands" created with Svelte.

A custom solution is used to support multilingual capabilities.

## Getting Started

To start, install the package:

```bash
npm i astro-x-svelte-static-pages-generator@latest
```

After installation, a basic project template will be set up. Feel free to modify it as needed; the template is provided for reference.

## Localization

In the translations folder of the template project, you’ll find sample JSON files with key-value pairs and helper functions for managing translations.

During development, create subfolders within the pages directory for each language prefix you want to support, then call the getLangSettings function to create a language dictionary. You can then reference it as a JavaScript object:

```javascript
const { t } = getLangSettings(Astro.url);
```

```astro
<div>
{t.your_key}
</div>
```

Note: You can only create the dictionary in an Astro component since it relies on the `Astro.url ` object to determine the locale. To use the dictionary in other components, pass it as a prop.

## Utility Functions

Several helpful functions are included in the project for general use:

### `debounce`

Limits the number of times a function is called within a specified period. It takes a function as the first argument and a delay as the second. This decorator is useful when you need to reduce the number of function calls, such as during page scroll or resize events.

**Example**: A user types in a field, and `debounce` resets a timer, waiting until typing stops. Once the user finishes (e.g., after 300 ms), the function is triggered.

```javascript
import { debounce } from "astro-x-svelte-static-pages-generator";
const debouncedFunction = debounce(() => console.log("Function call"), 300);
window.addEventListener("resize", debouncedFunction);
```

### `throttle`

Another decorator that reduces function call frequency, ensuring the function is called no more than once within a given interval.

**Example**: During scrolling, throttle ensures the function is called once every specified period (e.g., every 200 ms), regardless of the scroll frequency.

```javascript
import { throttle } from "astro-x-svelte-static-pages-generator";
const throttledFunction = throttle(() => console.log("Function call"), 200);
window.addEventListener("resize", throttledFunction);
```

### `getOS`

Returns the operating system based on the user's browser user agent.

Note: This function only works on the client side.

```javascript
import { getOS } from "astro-x-svelte-static-pages-generator";
const OS = getOS();
```

### `checkDate`

Checks if a specified date has passed, returning a boolean.

```javascript
import { checkDate } from "astro-x-svelte-static-pages-generator";
const isMerryChristmas = checkDate("25 December 2025");
```
