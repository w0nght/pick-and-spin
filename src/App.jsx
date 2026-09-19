import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Dices,
  Plus,
  RotateCw,
  Share2,
  Trash2,
} from "lucide-react";

import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/hooks/useTheme";

import CategoryButton from "@/components/picker/CategoryButton";
import ItemEditor from "@/components/picker/ItemEditor";
import ResultModal from "@/components/picker/ResultModal";
import ShareModal from "@/components/picker/ShareModal";
import WheelCanvas from "@/components/picker/WheelCanvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CATEGORY_META,
  STARTER_COLORS,
  STARTER_CUISINES,
} from "@/data/wheelData";
import { loadWheelData, saveWheelData } from "@/lib/storage";

export default function App() {
  const { theme, cycleTheme } = useTheme();

  const [initialData] = useState(() => loadWheelData());

  const [wheels, setWheels] = useState(initialData.wheels);

  const [selectedId, setSelectedId] = useState(
    initialData.selectedId || initialData.wheels[0].id,
  );

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [wheelMenuOpen, setWheelMenuOpen] = useState(false);

  const spinTimer = useRef(null);

  const selectedWheel =
    wheels.find((wheel) => wheel.id === selectedId) || wheels[0];

  const activeCategory = selectedWheel?.category || "food";

  const customWheels = wheels.filter((wheel) => wheel.category === "custom");

  useEffect(() => {
    saveWheelData(wheels, selectedId);
  }, [wheels, selectedId]);

  useEffect(() => {
    return () => {
      window.clearTimeout(spinTimer.current);
    };
  }, []);

  function updateSelectedWheel(changes) {
    setWheels((currentWheels) =>
      currentWheels.map((wheel) =>
        wheel.id === selectedWheel.id
          ? {
              ...wheel,
              ...changes,
            }
          : wheel,
      ),
    );
  }

  function getStartingItems(category) {
    if (category === "food") {
      return STARTER_CUISINES;
    }

    if (category === "colors") {
      return STARTER_COLORS;
    }

    if (category === "coin") {
      return ["Heads", "Tails"];
    }

    return ["Option 1", "Option 2", "Option 3"];
  }

  function selectCategory(category) {
    const existingWheel = wheels.find((wheel) => wheel.category === category);

    if (existingWheel) {
      setSelectedId(existingWheel.id);
      return;
    }

    const newWheel = {
      // id: createWheelId(),
      id: createWheelId(category, wheels),
      category,
      name:
        category === "custom"
          ? "My custom wheel"
          : CATEGORY_META[category].label,
      items: getStartingItems(category),
    };

    setWheels((currentWheels) => [...currentWheels, newWheel]);

    setSelectedId(newWheel.id);
  }

  function createCustomWheel() {
    const customWheelNumber = customWheels.length + 1;

    const newWheel = {
      // id: createWheelId(),
      id: createWheelId("custom", wheels),
      category: "custom",
      name: `My wheel ${customWheelNumber}`,
      items: ["Option 1", "Option 2", "Option 3"],
    };

    setWheels((currentWheels) => [...currentWheels, newWheel]);

    setSelectedId(newWheel.id);
    setWheelMenuOpen(false);
  }

  function createWheelId(category, existingWheels) {
    let wheelNumber = existingWheels.length + 1;
    let wheelId = `${category}-wheel-${wheelNumber}`;

    while (existingWheels.some((wheel) => wheel.id === wheelId)) {
      wheelNumber += 1;
      wheelId = `${category}-wheel-${wheelNumber}`;
    }

    return wheelId;
  }

  function deleteSelectedWheel() {
    if (selectedWheel.category !== "custom") {
      return;
    }

    const remainingWheels = wheels.filter(
      (wheel) => wheel.id !== selectedWheel.id,
    );

    setWheels(remainingWheels);
    setSelectedId(remainingWheels[0].id);
  }

  function spinWheel() {
    if (spinning || selectedWheel.items.length < 2) {
      return;
    }

    const winningIndex = Math.floor(Math.random() * selectedWheel.items.length);

    const segmentAngle = 360 / selectedWheel.items.length;

    const winningSegmentCenter = winningIndex * segmentAngle + segmentAngle / 2;

    const normalisedRotation = ((rotation % 360) + 360) % 360;

    const targetRotation = (360 - winningSegmentCenter) % 360;

    const correction = (targetRotation - normalisedRotation + 360) % 360;

    const nextRotation = rotation + 360 * 6 + correction;

    const winningItem = selectedWheel.items[winningIndex];

    setResult(null);
    setSpinning(true);
    setRotation(nextRotation);

    window.clearTimeout(spinTimer.current);

    spinTimer.current = window.setTimeout(() => {
      setSpinning(false);
      setResult(winningItem);
    }, 4650);
  }

  function spinAgain() {
    setResult(null);

    window.setTimeout(() => {
      spinWheel();
    }, 120);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#F8F7FC] text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* background decoration */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl dark:bg-violet-900/20" />
        <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-pink-200/35 blur-3xl dark:bg-fuchsia-900/20" />
      </div>

      {/* header */}
      <header className="relative z-30 border-b border-white/70 bg-white/70 backdrop-blur-xl transition-colors dark:border-slate-800 dark:bg-slate-950/75">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 text-white shadow-lg shadow-violet-200">
              <Dices size={21} />
            </span>

            <div>
              {/* logo tile */}
              <p className="text-base font-black leading-tight tracking-tight text-slate-950 dark:text-white">
                Pick & Spin
              </p>

              {/* subtitle */}
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Let chance decide
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} onToggle={cycleTheme} />

            <Button
              variant="outline"
              onClick={() => setShareOpen(true)}
              className="rounded-xl border-slate-200 bg-white/90 text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Share2 size={17} className="mr-0 sm:mr-2" />

              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-6">
          <div className="mb-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-violet-600">
              Choose a category
            </p>

            {/* page heading */}
            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              What are we deciding?
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {Object.keys(CATEGORY_META).map((category) => (
              <CategoryButton
                key={category}
                category={category}
                active={activeCategory === category}
                onClick={() => selectCategory(category)}
              />
            ))}
          </div>
        </section>

        <section className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* wheel card */}
          <Card className="overflow-hidden rounded-[28px] border-white bg-white/80 shadow-xl shadow-violet-100/50 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-900/85 dark:text-slate-100 dark:shadow-black/20">
            <CardContent className="p-4 sm:p-7">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <input
                    value={selectedWheel.name}
                    onChange={(event) =>
                      updateSelectedWheel({
                        name: event.target.value,
                      })
                    }
                    maxLength={50}
                    // wheel title
                    className="w-full truncate bg-transparent text-xl font-black text-slate-950 outline-none focus:text-violet-700 dark:text-white dark:focus:text-violet-400 sm:text-2xl"
                    aria-label="Wheel name"
                  />

                  {/* description */}
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Tap the title to rename this wheel.
                  </p>
                </div>

                {activeCategory === "custom" && (
                  <div className="relative">
                    {/* My Wheels button */}
                    <Button
                      variant="outline"
                      onClick={() =>
                        setWheelMenuOpen((currentValue) => !currentValue)
                      }
                      className="rounded-xl dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      My wheels
                      <ChevronDown size={15} className="ml-2" />
                    </Button>

                    <AnimatePresence>
                      {wheelMenuOpen && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            y: -6,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                            y: -6,
                          }}
                          // menu container
                          className="absolute right-0 top-12 z-30 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-700 dark:bg-slate-800"
                        >
                          <div className="max-h-44 overflow-y-auto">
                            {customWheels.map((wheel) => (
                              <button
                                key={wheel.id}
                                type="button"
                                onClick={() => {
                                  setSelectedId(wheel.id);
                                  setWheelMenuOpen(false);
                                }}
                                // each wheel button
                                className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-semibold hover:bg-violet-50 dark:hover:bg-slate-700 ${
                                  wheel.id === selectedWheel.id
                                    ? "text-violet-700 dark:text-violet-300"
                                    : "text-slate-700 dark:text-slate-200"
                                }`}
                              >
                                <span className="truncate">{wheel.name}</span>

                                {wheel.id === selectedWheel.id && (
                                  <Check size={15} className="ml-auto" />
                                )}
                              </button>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={createCustomWheel}
                            // "New custom wheel" button
                            className="mt-1 flex w-full items-center rounded-xl border-t border-slate-100 px-3 py-2.5 text-left text-sm font-bold text-violet-700 hover:bg-violet-50 dark:border-slate-700 dark:text-violet-300 dark:hover:bg-slate-700"
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
                  items={selectedWheel.items}
                  // This prevents food and custom options from being interpreted as colors.
                  category={selectedWheel.category}
                  rotation={rotation}
                  spinning={spinning}
                />
              </div>

              <div className="mx-auto mt-3 max-w-md">
                <Button
                  onClick={spinWheel}
                  disabled={spinning || selectedWheel.items.length < 2}
                  className="h-14 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-base font-black shadow-lg shadow-violet-200 transition hover:scale-[1.01] hover:from-violet-700 hover:to-fuchsia-700 disabled:scale-100"
                >
                  <RotateCw
                    size={19}
                    className={`mr-2 ${spinning ? "animate-spin" : ""}`}
                  />

                  {spinning
                    ? "Spinning…"
                    : selectedWheel.items.length < 2
                      ? "Add at least 2 options"
                      : "Spin the wheel"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* options card */}
          <Card className="rounded-[28px] border-white bg-white/85 shadow-xl shadow-violet-100/50 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-900/85 dark:text-slate-100 dark:shadow-black/20 lg:sticky lg:top-5">
            <CardContent className="p-5">
              <ItemEditor
                items={selectedWheel.items}
                category={selectedWheel.category}
                onChange={(items) => updateSelectedWheel({ items })}
                disabled={spinning}
              />

              {selectedWheel.category === "custom" &&
                customWheels.length > 1 && (
                  <button
                    type="button"
                    onClick={deleteSelectedWheel}
                    className="mt-5 flex w-full items-center justify-center rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete this wheel
                  </button>
                )}

              <div className="mt-5 rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/35">
                <div className="flex gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700dark:bg-emerald-900 dark:text-emerald-300">
                    <Check size={17} />
                  </span>

                  <div>
                    <p className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                      Saved automatically
                    </p>

                    <p className="mt-0.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                      Your wheels stay on this device using local storage.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <footer className="relative mx-auto max-w-7xl px-4 py-8 text-center text-xs text-slate-400 dark:text-slate-500">
        Made for delightfully difficult decisions.
      </footer>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />

      <ResultModal
        result={result}
        onClose={() => setResult(null)}
        onSpinAgain={spinAgain}
      />
    </main>
  );
}
