import { CATEGORY_META } from "@/data/wheelData";

export default function CategoryButton({ category, active, onClick }) {
  const categoryDetails = CATEGORY_META[category];
  const Icon = categoryDetails.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-w-[150px] flex-1 items-center gap-3 rounded-2xl border p-3 text-left transition ${
        active
          ? "border-violet-300 bg-violet-50 text-violet-950 shadow-sm"
          : "border-slate-200 bg-white text-slate-700 hover:border-violet-200 hover:bg-violet-50/50"
      }`}
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
          active
            ? "bg-violet-600 text-white"
            : "bg-slate-100 text-slate-600 group-hover:bg-violet-100"
        }`}
      >
        <Icon size={19} />
      </span>

      <span>
        <span className="block text-sm font-bold">{categoryDetails.label}</span>

        <span className="block text-xs text-slate-500">
          {categoryDetails.subtitle}
        </span>
      </span>
    </button>
  );
}
