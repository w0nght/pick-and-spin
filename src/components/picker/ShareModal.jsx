import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Link2, Share2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getShareUrl } from "@/lib/storage";

export default function ShareModal({ open, onClose }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = getShareUrl();

  const qrCodeUrl =
    "https://api.qrserver.com/v1/create-qr-code/" +
    `?size=320x320&margin=12&data=${encodeURIComponent(shareUrl)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      window.prompt("Copy this link:", shareUrl);
    }
  }

  async function shareWebsite() {
    if (!navigator.share) {
      await copyLink();
      return;
    }

    try {
      await navigator.share({
        title: "Pick & Spin",
        text: "Try this random picker wheel!",
        url: shareUrl,
      });
    } catch {
      // The user may have cancelled the share dialog.
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 10,
              scale: 0.97,
            }}
            className="w-full max-w-md rounded-3xl bg-white p-6 text-slate-900 shadow-2xl dark:bg-slate-900 dark:text-slate-100"
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Share this picker
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Scan the QR code or send the direct link.
                </p>
              </div>

              {/* close button */}
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                aria-label="Close share dialog"
              >
                <X size={19} />
              </button>
            </div>

            {/* QR Code container */}
            <div className="mx-auto mb-5 flex w-fit max-w-full flex-col items-center rounded-3xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700">
              <img
                src={qrCodeUrl}
                alt="QR code linking to Pick & Spin"
                className="mb-3 block rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800"
              />

              <div className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                <Link2 size={16} className="shrink-0 text-slate-400" />

                <span className="min-w-0 flex-1 truncate text-sm text-slate-600 dark:text-slate-300">
                  {shareUrl}
                </span>
              </div>

              <Button
                variant="outline"
                onClick={copyLink}
                className="mt-3 w-full justify-center rounded-lg bg-white"
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
              onClick={shareWebsite}
              className="w-full rounded-xl bg-violet-600 py-5 hover:bg-violet-700"
            >
              <Share2 size={17} className="mr-2" />
              Share with someone
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
