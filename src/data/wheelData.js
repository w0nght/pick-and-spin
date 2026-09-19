import { Edit3, Palette, RotateCw, Utensils } from "lucide-react";
export const STORAGE_KEY = "joey-random-picker-wheel-v1";

// fallback palette for food and custom wheels
export const WHEEL_COLORS = [
  "#7C3AED",
  "#EC4899",
  "#F97316",
  "#EAB308",
  "#10B981",
  "#06B6D4",
  "#3B82F6",
  "#8B5CF6",
];

export const STARTER_CUISINES = [
  "Italian",
  "Japanese",
  "Chinese",
  "Thai",
  "Indian",
  "Mexican",
  "Vietnamese",
  "Greek",
];

export const STARTER_COLORS = [
  "Red",
  "Orange",
  "Yellow",
  "Green",
  "Light Green",
  "Blue",
  "Light Blue",
  "Purple",
  "Pink",
  "Brown",
  "Grey",
  "Light Grey",
  "Black",
  "White",
];

export const DEFAULT_WHEELS = [
  {
    id: "food-cuisines",
    category: "food",
    name: "What should we eat?",
    items: STARTER_CUISINES,
  },
  {
    id: "color-picker",
    category: "colors",
    name: "Color picker",
    items: STARTER_COLORS,
  },
  {
    id: "heads-or-tails",
    category: "coin",
    name: "Heads or tails",
    items: ["Heads", "Tails"],
  },
];

export const CATEGORY_META = {
  food: { label: "Food", subtitle: "Choose a cuisine", icon: Utensils },
  colors: { label: "Colors", subtitle: "Pick a color", icon: Palette },
  coin: {
    label: "Heads or tails",
    subtitle: "Flip a virtual coin",
    icon: RotateCw,
  },
  custom: { label: "Custom", subtitle: "Build your own", icon: Edit3 },
};
