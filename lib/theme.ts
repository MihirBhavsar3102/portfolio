export type Theme = "light" | "dark";

export const THEME_KEY = "theme";

/**
 * Inlined in <head> so the page paints in the right theme from the first
 * frame: the visitor's stored choice, else the system setting. Without
 * JavaScript, globals.css follows prefers-color-scheme on its own.
 */
export const themeScript = `(function(){var d=document.documentElement,t;try{t=localStorage.getItem("${THEME_KEY}")}catch(e){}if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.dataset.theme=t;d.style.colorScheme=t})()`;

/** Switches the page's theme and remembers the choice. */
export function setTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage blocked: the switch still holds for this page view.
  }
}
