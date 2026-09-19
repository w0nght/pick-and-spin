import { Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

const THEME_DETAILS = {
  system: {
    label: "System theme",
    nextTheme: "light",
    icon: Monitor,
  },
  light: {
    label: "Light theme",
    nextTheme: "dark",
    icon: Sun,
  },
  dark: {
    label: "Dark theme",
    nextTheme: "system",
    icon: Moon,
  },
};

export default function ThemeToggle({ theme, onToggle }) {
  const themeDetails = THEME_DETAILS[theme] ?? THEME_DETAILS.system;

  const Icon = themeDetails.icon;

  return (
    <Button
      type="button"
      variant="outline"
      onClick={onToggle}
      className="rounded-xl border-slate-200 bg-white/90 text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-700"
      aria-label={`${themeDetails.label}. Switch to ${themeDetails.nextTheme} theme.`}
      title={`${themeDetails.label}. Click for ${themeDetails.nextTheme} theme.`}
    >
      <Icon size={17} />

      <span className="ml-2 hidden sm:inline">{themeDetails.label}</span>
    </Button>
  );
}
