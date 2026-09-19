import {
  Coffee,
  Cookie,
  Edit3,
  Palette,
  RotateCw,
  Utensils,
} from "lucide-react";
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
  "Cantonese",
  "Japanese",
  "Chinese",
  "Italian",
  "Thai",
  "Indian",
  "Mexican",
  "Vietnamese",
  "Greek",
];

export const QUICK_FOOD_OPTIONS = [
  "Burger",
  "Rice Bowl",
  "Noodles",
  "Sandwich",
  "Sushi",
  "Bubble Tea",
  "Pasta",
  "Salad",
  "Poke Bowl",
  "Pizza",
  "Tacos",
  "Dumplings",
];

export const SNACK_TREAT_OPTIONS = [
  "Ice Cream",
  "Cake",
  "Cookies",
  "Donuts",
  "Chocolate",
  "Popcorn",
  "Chips",
  "Yogurt",
  "Muffin",
  "Brownie",
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
];

export const DEFAULT_WHEELS = [
  {
    id: "food-cuisines",
    category: "food",
    name: "What cuisine should we eat?",
    items: STARTER_CUISINES,
  },
  {
    id: "quick-food",
    category: "quickFood",
    name: "What should I eat?",
    items: QUICK_FOOD_OPTIONS,
  },
  {
    id: "snacks-treats",
    category: "treats",
    name: "Choose a snack or treat",
    items: SNACK_TREAT_OPTIONS,
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
  food: {
    label: "Cuisines",
    subtitle: "Choose a cuisine",
    icon: Utensils,
  },
  quickFood: {
    label: "Quick Food",
    subtitle: "Choose something to eat",
    icon: Coffee,
  },
  treats: {
    label: "Treats",
    subtitle: "Choose a snack or dessert",
    icon: Cookie,
  },
  colors: {
    label: "Colors",
    subtitle: "Pick a color",
    icon: Palette,
  },
  coin: {
    label: "Heads or tails",
    subtitle: "Flip a virtual coin",
    icon: RotateCw,
  },
  custom: {
    label: "Custom",
    subtitle: "Build your own",
    icon: Edit3,
  },
};
