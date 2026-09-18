import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronDown,
  Copy,
  Dices,
  Edit3,
  ExternalLink,
  Link2,
  Palette,
  Plus,
  QrCode,
  RotateCw,
  Share2,
  Sparkles,
  Trash2,
  Utensils,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const STORAGE_KEY = "joey-random-picker-wheel-v1";

const WHEEL_COLORS = [
  "#7C3AED",
  "#EC4899",
  "#F97316",
  "#EAB308",
  "#10B981",
  "#06B6D4",
  "#3B82F6",
  "#8B5CF6",
];

const STARTER_CUISINES = [
  "Italian",
  "Japanese",
  "Chinese",
  "Thai",
  "Indian",
  "Mexican",
  "Vietnamese",
  "Greek",
];

const STARTER_COLORS = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple"];

const DEFAULT_WHEELS = [
  {
    id: "food-cuisines",
    category: "food",
    name: "What should we eat?",
    items: STARTER_CUISINES,
    updatedAt: Date.now(),
  },
  {
    id: "color-picker",
    category: "colors",
    name: "Color picker",
    items: STARTER_COLORS,
    updatedAt: Date.now(),
  },
  {
    id: "heads-or-tails",
    category: "coin",
    name: "Heads or tails",
    items: ["Heads", "Tails"],
    updatedAt: Date.now(),
  },
];

const CATEGORY_META = {
  food: { label: "Food", subtitle: "Choose a cuisine", icon: Utensils },
  colors: { label: "Colors", subtitle: "Pick a color", icon: Palette },
  coin: {
    label: "Heads or tails",
    subtitle: "Flip a virtual coin",
    icon: RotateCw,
  },
  custom: { label: "Custom", subtitle: "Build your own", icon: Edit3 },
};

function uid() {
  return `wheel-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function safeLoad() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw)
      return { wheels: DEFAULT_WHEELS, selectedId: DEFAULT_WHEELS[0].id };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.wheels) || parsed.wheels.length === 0)
      throw new Error("Invalid data");
    return parsed;
  } catch {
    return { wheels: DEFAULT_WHEELS, selectedId: DEFAULT_WHEELS[0].id };
  }
}

function getShareUrl() {
  if (typeof window === "undefined") return "https://your-site.netlify.app";
  return `${window.location.origin}${window.location.pathname}`;
}

function truncate(text, max = 18) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function WheelCanvas({ items, rotation, spinning }) {
  const size = 480;
  const center = size / 2;
  const radius = 218;
  const safeItems = items.length ? items : ["Add an item"];
  const segmentAngle = 360 / safeItems.length;

  function describeArc(startAngle, endAngle) {
    const polar = (angle) => {
      const radians = ((angle - 90) * Math.PI) / 180;
      return {
        x: center + radius * Math.cos(radians),
        y: center + radius * Math.sin(radians),
      };
    };
    const start = polar(endAngle);
    const end = polar(startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    return [
      `M ${center} ${center}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
      "Z",
    ].join(" ");
  }

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px] select-none">
      <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1 drop-shadow-lg">
        <div className="h-0 w-0 border-l-[18px] border-r-[18px] border-t-[34px] border-l-transparent border-r-transparent border-t-slate-950" />
      </div>
      <motion.div
        className="h-full w-full rounded-full p-3 shadow-[0_24px_70px_rgba(76,29,149,0.22)]"
        animate={{ rotate: rotation }}
        transition={
          spinning
            ? { duration: 4.6, ease: [0.12, 0.7, 0.1, 1] }
            : { duration: 0 }
        }
      >
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="h-full w-full overflow-visible rounded-full"
        >
          <circle cx={center} cy={center} r={radius + 10} fill="#111827" />
          {safeItems.map((item, index) => {
            const start = index * segmentAngle;
            const end = (index + 1) * segmentAngle;
            const mid = start + segmentAngle / 2;
            const textRadius = safeItems.length > 10 ? 140 : 150;
            const radians = ((mid - 90) * Math.PI) / 180;
            const x = center + textRadius * Math.cos(radians);
            const y = center + textRadius * Math.sin(radians);
            const fontSize =
              safeItems.length > 14 ? 11 : safeItems.length > 9 ? 13 : 16;
            return (
              <g key={`${item}-${index}`}>
                <path
                  d={describeArc(start, end)}
                  fill={WHEEL_COLORS[index % WHEEL_COLORS.length]}
                  stroke="rgba(255,255,255,.55)"
                  strokeWidth="2"
                />
                <text
                  x={x}
                  y={y}
                  fill="white"
                  fontSize={fontSize}
                  fontWeight="700"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${mid}, ${x}, ${y})`}
                  className="drop-shadow"
                >
                  {truncate(item, safeItems.length > 10 ? 12 : 18)}
                </text>
              </g>
            );
          })}
          <circle
            cx={center}
            cy={center}
            r="42"
            fill="white"
            stroke="#111827"
            strokeWidth="8"
          />
          <circle cx={center} cy={center} r="15" fill="#7C3AED" />
        </svg>
      </motion.div>
    </div>
  );
}

function CategoryButton({ category, active, onClick }) {
  const meta = CATEGORY_META[category];
  const Icon = meta.icon;
  return (
    <button
      onClick={onClick}
      className={`group flex min-w-[150px] flex-1 items-center gap-3 rounded-2xl border p-3 text-left transition ${
        active
          ? "border-violet-300 bg-violet-50 text-violet-950 shadow-sm"
          : "border-slate-200 bg-white text-slate-700 hover:border-violet-200 hover:bg-violet-50/50"
      }`}
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${active ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600 group-hover:bg-violet-100"}`}
      >
        <Icon size={19} />
      </span>
      <span>
        <span className="block text-sm font-bold">{meta.label}</span>
        <span className="block text-xs text-slate-500">{meta.subtitle}</span>
      </span>
    </button>
  );
}

function ItemEditor({ items, category, onChange, disabled }) {
  const [draft, setDraft] = useState("");

  const addItem = () => {
    const clean = draft.trim();
    if (!clean || items.some((x) => x.toLowerCase() === clean.toLowerCase()))
      return;
    onChange([...items, clean]);
    setDraft("");
  };

  return (
    <div className={disabled ? "pointer-events-none opacity-60" : ""}>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900">Wheel options</h3>
          <p className="text-xs text-slate-500">
            {items.length} item{items.length === 1 ? "" : "s"} · minimum 2 to
            spin
          </p>
        </div>
      </div>

      {category !== "coin" && (
        <div className="mb-4 flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder={
              category === "food" ? "Add another cuisine…" : "Add an option…"
            }
            maxLength={40}
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
          />
          <Button
            onClick={addItem}
            className="rounded-xl bg-violet-600 hover:bg-violet-700"
            aria-label="Add item"
          >
            <Plus size={18} />
          </Button>
        </div>
      )}

      <div className="max-h-[300px] space-y-2 overflow-y-auto pr-1">
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
          >
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ background: WHEEL_COLORS[index % WHEEL_COLORS.length] }}
            />
            <input
              value={item}
              disabled={category === "coin"}
              onChange={(e) => {
                const updated = [...items];
                updated[index] = e.target.value;
                onChange(updated);
              }}
              onBlur={() =>
                onChange(items.map((x) => x.trim()).filter(Boolean))
              }
              maxLength={40}
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-700 outline-none disabled:cursor-not-allowed"
              aria-label={`Edit ${item}`}
            />
            {category !== "coin" && (
              <button
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                aria-label={`Remove ${item}`}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ShareModal({ open, onClose }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = getShareUrl();
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&data=${encodeURIComponent(shareUrl)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy this link:", shareUrl);
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Random Picker Wheel",
          text: "Try this random picker wheel!",
          url: shareUrl,
        });
      } catch {}
    } else {
      copyLink();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Share this picker
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Scan the QR code or send the direct link.
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mx-auto mb-5 w-fit rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
              <img
                src={qrUrl}
                alt="QR code linking to this website"
                className="h-52 w-52 rounded-2xl"
              />
            </div>

            <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 pl-3">
              <Link2 size={16} className="shrink-0 text-slate-400" />
              <span className="min-w-0 flex-1 truncate text-sm text-slate-600">
                {shareUrl}
              </span>
              <Button
                variant="outline"
                onClick={copyLink}
                className="rounded-lg bg-white"
              >
                {copied ? (
                  <Check size={16} className="text-emerald-600" />
                ) : (
                  <Copy size={16} />
                )}
                <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
              </Button>
            </div>
            <Button
              onClick={nativeShare}
              className="w-full rounded-xl bg-violet-600 py-5 hover:bg-violet-700"
            >
              <Share2 size={17} className="mr-2" /> Share with someone
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ResultModal({ result, onClose, onSpinAgain }) {
  return (
    <AnimatePresence>
      {result && (
        <motion.div
          className="fixed inset-0 z-40 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.76, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 18, stiffness: 240 }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-7 text-center shadow-2xl"
          >
            <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full bg-pink-200/60 blur-2xl" />
            <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-violet-200/70 blur-2xl" />
            <div className="relative">
              <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-violet-100 text-violet-600">
                <Sparkles size={27} />
              </span>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-500">
                The wheel chose
              </p>
              <h2 className="my-3 break-words text-3xl font-black text-slate-950">
                {result}
              </h2>
              <p className="mb-6 text-sm text-slate-500">
                Decision made. Unless you want one more spin.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="rounded-xl py-5"
                >
                  Done
                </Button>
                <Button
                  onClick={onSpinAgain}
                  className="rounded-xl bg-violet-600 py-5 hover:bg-violet-700"
                >
                  <RotateCw size={16} className="mr-2" />
                  Again
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function RandomPickerWheelApp() {
  const initial = useMemo(safeLoad, []);
  const [wheels, setWheels] = useState(initial.wheels);
  const [selectedId, setSelectedId] = useState(
    initial.selectedId || initial.wheels[0].id,
  );
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const spinTimer = useRef(null);

  const selected = wheels.find((wheel) => wheel.id === selectedId) || wheels[0];
  const activeCategory = selected?.category || "food";

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ wheels, selectedId }));
  }, [wheels, selectedId]);

  useEffect(() => () => clearTimeout(spinTimer.current), []);

  const updateSelected = (patch) => {
    setWheels((current) =>
      current.map((wheel) =>
        wheel.id === selected.id
          ? { ...wheel, ...patch, updatedAt: Date.now() }
          : wheel,
      ),
    );
  };

  const pickCategory = (category) => {
    const existing = wheels.find((wheel) => wheel.category === category);
    if (existing) {
      setSelectedId(existing.id);
    } else {
      const newWheel = {
        id: uid(),
        category,
        name:
          category === "custom"
            ? "My custom wheel"
            : CATEGORY_META[category].label,
        items:
          category === "food"
            ? STARTER_CUISINES
            : category === "colors"
              ? STARTER_COLORS
              : ["Heads", "Tails"],
        updatedAt: Date.now(),
      };
      setWheels((current) => [...current, newWheel]);
      setSelectedId(newWheel.id);
    }
  };

  const createCustomWheel = () => {
    const newWheel = {
      id: uid(),
      category: "custom",
      name: `My wheel ${wheels.filter((x) => x.category === "custom").length + 1}`,
      items: ["Option 1", "Option 2", "Option 3"],
      updatedAt: Date.now(),
    };
    setWheels((current) => [...current, newWheel]);
    setSelectedId(newWheel.id);
    setMenuOpen(false);
  };

  const deleteSelected = () => {
    if (selected.category !== "custom") return;
    const remaining = wheels.filter((wheel) => wheel.id !== selected.id);
    setWheels(remaining);
    setSelectedId(remaining[0].id);
  };

  const spin = () => {
    if (spinning || selected.items.length < 2) return;
    const winningIndex = Math.floor(Math.random() * selected.items.length);
    const segmentAngle = 360 / selected.items.length;
    const centerAngle = winningIndex * segmentAngle + segmentAngle / 2;
    const currentNormalized = ((rotation % 360) + 360) % 360;
    const targetNormalized = (360 - centerAngle) % 360;
    const correction = (targetNormalized - currentNormalized + 360) % 360;
    const nextRotation = rotation + 360 * 6 + correction;

    setResult(null);
    setSpinning(true);
    setRotation(nextRotation);
    clearTimeout(spinTimer.current);
    spinTimer.current = setTimeout(() => {
      setSpinning(false);
      setResult(selected.items[winningIndex]);
    }, 4650);
  };

  const customWheels = wheels.filter((wheel) => wheel.category === "custom");

  return (
    <main className="min-h-screen overflow-hidden bg-[#F8F7FC] text-slate-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-pink-200/35 blur-3xl" />
      </div>

      <header className="relative z-30 border-b border-white/70 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 text-white shadow-lg shadow-violet-200">
              <Dices size={21} />
            </span>
            <div>
              <p className="text-base font-black leading-tight tracking-tight">
                Pick & Spin
              </p>
              <p className="text-[11px] font-medium text-slate-500">
                Let chance decide
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShareOpen(true)}
            className="rounded-xl border-slate-200 bg-white/90 shadow-sm"
          >
            <Share2 size={17} className="mr-0 sm:mr-2" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>
      </header>

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-6">
          <div className="mb-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-violet-600">
              Choose a category
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
              What are we deciding?
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {Object.keys(CATEGORY_META).map((category) => (
              <CategoryButton
                key={category}
                category={category}
                active={activeCategory === category}
                onClick={() => pickCategory(category)}
              />
            ))}
          </div>
        </section>

        <section className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Card className="overflow-hidden rounded-[28px] border-white bg-white/80 shadow-xl shadow-violet-100/50 backdrop-blur">
            <CardContent className="p-4 sm:p-7">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <input
                    value={selected.name}
                    onChange={(e) => updateSelected({ name: e.target.value })}
                    maxLength={50}
                    className="w-full truncate bg-transparent text-xl font-black text-slate-950 outline-none focus:text-violet-700 sm:text-2xl"
                    aria-label="Wheel name"
                  />
                  <p className="mt-1 text-sm text-slate-500">
                    Tap the title to rename this wheel.
                  </p>
                </div>

                {activeCategory === "custom" && (
                  <div className="relative">
                    <Button
                      variant="outline"
                      onClick={() => setMenuOpen((x) => !x)}
                      className="rounded-xl"
                    >
                      My wheels <ChevronDown size={15} className="ml-2" />
                    </Button>
                    <AnimatePresence>
                      {menuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="absolute right-0 top-12 z-30 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl"
                        >
                          <div className="max-h-44 overflow-y-auto">
                            {customWheels.map((wheel) => (
                              <button
                                key={wheel.id}
                                onClick={() => {
                                  setSelectedId(wheel.id);
                                  setMenuOpen(false);
                                }}
                                className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-semibold hover:bg-violet-50 ${wheel.id === selected.id ? "text-violet-700" : "text-slate-700"}`}
                              >
                                <span className="truncate">{wheel.name}</span>
                                {wheel.id === selected.id && (
                                  <Check size={15} className="ml-auto" />
                                )}
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={createCustomWheel}
                            className="mt-1 flex w-full items-center rounded-xl border-t border-slate-100 px-3 py-2.5 text-left text-sm font-bold text-violet-700 hover:bg-violet-50"
                          >
                            <Plus size={16} className="mr-2" />
                            New custom wheel
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              <div className="mx-auto max-w-[560px] py-2 sm:py-4">
                <WheelCanvas
                  items={selected.items}
                  rotation={rotation}
                  spinning={spinning}
                />
              </div>

              <div className="mx-auto mt-3 max-w-md">
                <Button
                  onClick={spin}
                  disabled={spinning || selected.items.length < 2}
                  className="h-14 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-base font-black shadow-lg shadow-violet-200 transition hover:scale-[1.01] hover:from-violet-700 hover:to-fuchsia-700 disabled:scale-100"
                >
                  <RotateCw
                    size={19}
                    className={`mr-2 ${spinning ? "animate-spin" : ""}`}
                  />
                  {spinning
                    ? "Spinning…"
                    : selected.items.length < 2
                      ? "Add at least 2 options"
                      : "Spin the wheel"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-white bg-white/85 shadow-xl shadow-violet-100/50 backdrop-blur lg:sticky lg:top-5">
            <CardContent className="p-5">
              <ItemEditor
                items={selected.items}
                category={selected.category}
                onChange={(items) => updateSelected({ items })}
                disabled={spinning}
              />

              {selected.category === "custom" && customWheels.length > 1 && (
                <button
                  onClick={deleteSelected}
                  className="mt-5 flex w-full items-center justify-center rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete this wheel
                </button>
              )}

              <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
                <div className="flex gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Check size={17} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-emerald-950">
                      Saved automatically
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-emerald-700">
                      Your wheels stay on this device using local storage.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <footer className="relative mx-auto max-w-7xl px-4 py-8 text-center text-xs text-slate-400">
        Made for delightfully difficult decisions.
      </footer>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
      <ResultModal
        result={result}
        onClose={() => setResult(null)}
        onSpinAgain={() => {
          setResult(null);
          setTimeout(spin, 120);
        }}
      />
    </main>
  );
}
