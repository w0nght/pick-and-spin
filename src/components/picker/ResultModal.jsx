import { AnimatePresence, motion } from "framer-motion";
import { RotateCw, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ResultModal({ result, onClose, onSpinAgain }) {
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
            initial={{
              scale: 0.76,
              opacity: 0,
              y: 30,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
            }}
            exit={{
              scale: 0.9,
              opacity: 0,
            }}
            transition={{
              type: "spring",
              damping: 18,
              stiffness: 240,
            }}
            // result card
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-7 text-center text-slate-900 shadow-2xl dark:bg-slate-900 dark:text-slate-100"
          >
            <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full bg-pink-200/60 blur-2xl" />
            <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-violet-200/70 blur-2xl" />

            <div className="relative">
              {/* icon container */}
              <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300">
                <Sparkles size={27} />
              </span>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-500">
                The wheel chose
              </p>

              {/* result text */}
              <h2 className="my-3 break-words text-3xl font-black text-slate-950 dark:text-white">
                {result}
              </h2>

              <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                Decision made. Unless you want one more spin.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="rounded-xl py-5 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
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
