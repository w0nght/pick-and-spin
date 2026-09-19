import { motion } from "framer-motion";
import { getColorTextColor, getNamedColor } from "@/lib/colorUtils";
import { WHEEL_COLORS } from "@/data/wheelData";

function truncateText(text, maximumLength = 18) {
  if (text.length <= maximumLength) {
    return text;
  }

  return `${text.slice(0, maximumLength - 1)}…`;
}

export default function WheelCanvas({ items, category, rotation, spinning }) {
  const size = 480;
  const center = size / 2;
  const radius = 218;

  const safeItems = items.length ? items : ["Add an item"];

  const segmentAngle = 360 / safeItems.length;

  function getPointOnCircle(angle) {
    const radians = ((angle - 90) * Math.PI) / 180;

    return {
      x: center + radius * Math.cos(radians),
      y: center + radius * Math.sin(radians),
    };
  }

  function describeArc(startAngle, endAngle) {
    const start = getPointOnCircle(endAngle);
    const end = getPointOnCircle(startAngle);
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
      <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1 drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
        <div className="h-0 w-0 border-l-[18px] border-r-[18px] border-t-[34px] border-l-transparent border-r-transparent border-t-slate-950 dark:border-t-violet-300" />
      </div>

      <motion.div
        className="
          h-full w-full rounded-full bg-white p-3
          ring-1 ring-slate-200
          shadow-[0_24px_70px_rgba(76,29,149,0.22)]
          transition-[background-color,box-shadow]
          dark:bg-slate-700
          dark:ring-4 dark:ring-violet-400/70
          dark:shadow-[0_0_35px_rgba(139,92,246,0.55),0_24px_80px_rgba(0,0,0,0.7)]"
        animate={{ rotate: rotation }}
        transition={
          spinning
            ? {
                duration: 4.6,
                ease: [0.12, 0.7, 0.1, 1],
              }
            : {
                duration: 0,
              }
        }
      >
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="h-full w-full overflow-visible rounded-full"
          aria-label="Random picker wheel"
        >
          <circle
            cx={center}
            cy={center}
            r={radius + 10}
            className="fill-slate-900 dark:fill-slate-600"
          />

          {safeItems.map((item, index) => {
            const startAngle = index * segmentAngle;
            const endAngle = (index + 1) * segmentAngle;
            const middleAngle = startAngle + segmentAngle / 2;

            const textRadius = safeItems.length > 10 ? 140 : 150;

            const radians = ((middleAngle - 90) * Math.PI) / 180;

            const textX = center + textRadius * Math.cos(radians);

            const textY = center + textRadius * Math.sin(radians);

            const fontSize =
              safeItems.length > 14 ? 11 : safeItems.length > 9 ? 13 : 16;

            const fallbackColor = WHEEL_COLORS[index % WHEEL_COLORS.length];

            const segmentColor =
              category === "colors"
                ? (getNamedColor(item) ?? fallbackColor)
                : fallbackColor;

            const textColor =
              category === "colors" ? getColorTextColor(item) : "#FFFFFF";

            return (
              <g key={`${item}-${index}`}>
                <path
                  d={describeArc(startAngle, endAngle)}
                  fill={segmentColor}
                  stroke="rgba(255,255,255,.55)"
                  strokeWidth="2"
                />

                <text
                  x={textX}
                  y={textY}
                  fill={textColor}
                  fontSize={fontSize}
                  fontWeight="700"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${middleAngle}, ${textX}, ${textY})`}
                  className="drop-shadow"
                >
                  {truncateText(item, safeItems.length > 10 ? 12 : 18)}
                </text>
              </g>
            );
          })}

          <circle
            cx={center}
            cy={center}
            r="42"
            className="fill-white stroke-slate-900 dark:fill-slate-100 dark:stroke-violet-300"
            strokeWidth="8"
          />

          <circle cx={center} cy={center} r="15" fill="#7C3AED" />
        </svg>
      </motion.div>
    </div>
  );
}
