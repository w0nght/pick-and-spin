import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WHEEL_COLORS } from "@/data/wheelData";

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
        <h3 className="font-bold text-slate-900">Wheel options</h3>

        <p className="text-xs text-slate-500">
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
              style={{
                background: WHEEL_COLORS[index % WHEEL_COLORS.length],
              }}
            />

            <input
              value={item}
              disabled={!canEdit}
              onChange={(event) => updateItem(index, event.target.value)}
              onBlur={cleanItems}
              maxLength={40}
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-700 outline-none disabled:cursor-not-allowed"
              aria-label={`Edit ${item}`}
            />

            {canEdit && (
              <button
                type="button"
                onClick={() => removeItem(index)}
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
