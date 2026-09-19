import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WHEEL_COLORS } from "@/data/wheelData";
import { getNamedColor } from "@/lib/colorUtils";

export default function ItemEditor({ items, category, onChange, disabled }) {
  const [newItem, setNewItem] = useState("");

  const canEdit = category !== "coin";

  function addItem() {
    const cleanedItem = newItem.trim();

    if (!cleanedItem) {
      return;
    }

    const duplicateExists = items.some(
      (item) => item.toLowerCase() === cleanedItem.toLowerCase(),
    );

    if (duplicateExists) {
      return;
    }

    onChange([...items, cleanedItem]);
    setNewItem("");
  }

  function updateItem(index, value) {
    const updatedItems = [...items];
    updatedItems[index] = value;

    onChange(updatedItems);
  }

  function cleanItems() {
    const cleanedItems = items.map((item) => item.trim()).filter(Boolean);

    onChange(cleanedItems);
  }

  function removeItem(index) {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className={disabled ? "pointer-events-none opacity-60" : ""}>
      <div className="mb-3">
        <h3 className="font-bold text-slate-900 dark:text-slate-100">
          Wheel options
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {items.length} item
          {items.length === 1 ? "" : "s"} · minimum 2 to spin
        </p>
      </div>

      {canEdit && (
        <div className="mb-4 flex gap-2">
          <input
            value={newItem}
            onChange={(event) => setNewItem(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                addItem();
              }
            }}
            placeholder={
              category === "food"
                ? "Add another cuisine…"
                : category === "quickFood"
                  ? "Add another food or drink…"
                  : category === "treats"
                    ? "Add another snack or treat…"
                    : "Add an option…"
            }
            maxLength={40}
            // new item input
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-violet-500 dark:focus:ring-violet-950"
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
        {items.map((item, index) => {
          const fallbackColor = WHEEL_COLORS[index % WHEEL_COLORS.length];

          const itemColor =
            category === "colors"
              ? (getNamedColor(item) ?? fallbackColor)
              : fallbackColor;

          return (
            <div
              key={`${item}-${index}`}
              // option rows
              className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 transition-colors dark:border-slate-700 dark:bg-slate-800"
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full border border-black/10"
                style={{
                  backgroundColor: itemColor,
                }}
              />

              <input
                value={item}
                disabled={!canEdit}
                onChange={(event) => updateItem(index, event.target.value)}
                onBlur={cleanItems}
                maxLength={40}
                // item input
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-700 outline-none disabled:cursor-not-allowed dark:text-slate-200"
                aria-label={`Edit ${item}`}
              />

              {canEdit && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  // remove item button
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:text-slate-500 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                  aria-label={`Remove ${item}`}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
