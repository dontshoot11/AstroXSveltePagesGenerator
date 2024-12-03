<script>
  export let url;
  import { getLangSettings } from "@translations/translationSettings";
  import styles from "./style.module.css";

  const { t } = getLangSettings(url);

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
  {t.text}
</button>
