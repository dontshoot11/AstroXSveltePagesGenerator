<script>
  import { getTranslate } from "astro-x-svelte-static-pages-generator";
  import styles from "./style.module.css";

  const colors = ["red", "blue", "yellow"];

  let randomColor = getRandomColor(null);

  function getRandomColor(currentColor) {
    let newColor;
    do {
      const randomIndex = Math.floor(Math.random() * colors.length);
      newColor = colors[randomIndex];
    } while (newColor === currentColor);
    return newColor;
  }

  function changeColor() {
    randomColor = getRandomColor(randomColor);
  }
</script>

<button
  class={`${styles.component} ${styles[randomColor]}`}
  on:click={changeColor}
>
  {getTranslate("button_text", "button text fallback")}
</button>
