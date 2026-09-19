// Wheel segment automatically matches options such as Light Green, Dark Red, Light Blue, Grey, and other common colors.
// Non-color wheels will continue using the normal rotating palette.

const COLOR_NAME_MAP = {
  // Reds
  red: "#EF4444",
  "light red": "#FCA5A5",
  "dark red": "#991B1B",
  crimson: "#DC143C",
  maroon: "#800000",
  coral: "#FF7F50",
  salmon: "#FA8072",

  // Oranges
  orange: "#F97316",
  "light orange": "#FDBA74",
  "dark orange": "#C2410C",
  amber: "#F59E0B",
  peach: "#FFCBA4",

  // Yellows
  yellow: "#EAB308",
  "light yellow": "#FEF08A",
  "dark yellow": "#A16207",
  gold: "#FFD700",
  cream: "#FFFDD0",

  // Greens
  green: "#22C55E",
  "light green": "#86EFAC",
  "dark green": "#166534",
  lime: "#84CC16",
  olive: "#808000",
  mint: "#98FF98",
  teal: "#14B8A6",
  turquoise: "#40E0D0",
  emerald: "#10B981",

  // Blues
  blue: "#3B82F6",
  "light blue": "#93C5FD",
  "dark blue": "#1E3A8A",
  navy: "#000080",
  cyan: "#06B6D4",
  aqua: "#00FFFF",
  sky: "#38BDF8",
  indigo: "#4F46E5",

  // Purples
  purple: "#A855F7",
  "light purple": "#D8B4FE",
  "dark purple": "#6B21A8",
  violet: "#8B5CF6",
  lavender: "#E6E6FA",
  magenta: "#D946EF",
  plum: "#DDA0DD",

  // Pinks
  pink: "#EC4899",
  "light pink": "#FBCFE8",
  "dark pink": "#9D174D",
  rose: "#F43F5E",
  fuchsia: "#D946EF",

  // Browns
  brown: "#92400E",
  "light brown": "#D2B48C",
  "dark brown": "#451A03",
  tan: "#D2B48C",
  beige: "#F5F5DC",
  chocolate: "#7B3F00",

  // Greys
  grey: "#6B7280",
  gray: "#6B7280",
  "light grey": "#D1D5DB",
  "light gray": "#D1D5DB",
  "dark grey": "#374151",
  "dark gray": "#374151",
  silver: "#C0C0C0",
  charcoal: "#36454F",
  slate: "#64748B",

  // Neutral
  black: "#111827",
  white: "#FFFFFF",
  ivory: "#FFFFF0",
};

const LIGHT_COLORS = new Set([
  "light red",
  "light orange",
  "peach",
  "yellow",
  "light yellow",
  "gold",
  "cream",
  "light green",
  "lime",
  "mint",
  "turquoise",
  "light blue",
  "aqua",
  "sky",
  "light purple",
  "lavender",
  "plum",
  "light pink",
  "light brown",
  "tan",
  "beige",
  "light grey",
  "light gray",
  "silver",
  "white",
  "ivory",
]);

// Normalise color names to a consistent format: Light Green, light green, LIGHT GREEN, light-green, light_green
export function normaliseColorName(value) {
  return value.trim().toLowerCase().replace(/[-_]+/g, " ").replace(/\s+/g, " ");
}

export function getNamedColor(value) {
  const normalisedName = normaliseColorName(value);

  return COLOR_NAME_MAP[normalisedName] ?? null;
}

export function getColorTextColor(value) {
  const normalisedName = normaliseColorName(value);

  return LIGHT_COLORS.has(normalisedName) ? "#111827" : "#FFFFFF";
}
