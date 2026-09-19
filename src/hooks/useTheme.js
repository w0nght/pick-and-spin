import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "pick-and-spin-theme";

const THEME_OPTIONS = ["system", "light", "dark"];

function getSavedTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (THEME_OPTIONS.includes(savedTheme)) {
    return savedTheme;
  }

  return "system";
}

function systemPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(theme) {
  const useDarkTheme =
    theme === "dark" || (theme === "system" && systemPrefersDark());

  document.documentElement.classList.toggle("dark", useDarkTheme);
}

export function useTheme() {
  const [theme, setTheme] = useState(getSavedTheme);

  useEffect(() => {
    applyTheme(theme);

    localStorage.setItem(THEME_STORAGE_KEY, theme);

    if (theme !== "system") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function handleSystemThemeChange() {
      applyTheme("system");
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme]);

  function cycleTheme() {
    setTheme((currentTheme) => {
      const currentIndex = THEME_OPTIONS.indexOf(currentTheme);

      const nextIndex = (currentIndex + 1) % THEME_OPTIONS.length;

      return THEME_OPTIONS[nextIndex];
    });
  }

  return {
    theme,
    cycleTheme,
  };
}
