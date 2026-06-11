"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, Monitor } from "lucide-react";

const modes = ["light", "dark", "system"] as const;

/** True after hydration — avoids server/client theme mismatch. */
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/** Cycles light → dark → system. Announces current mode to screen readers. */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  const current = (mounted ? theme : "system") ?? "system";
  const next = modes[(modes.indexOf(current as (typeof modes)[number]) + 1) % modes.length];
  const Icon = current === "light" ? Sun : current === "dark" ? Moon : Monitor;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className="glass-button flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 hover:bg-accent-soft hover:text-accent"
      aria-label={`Theme: ${current}. Switch to ${next} mode`}
      title={`Theme: ${current} — click for ${next}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={current}
          className="flex"
          initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
        >
          <Icon size={18} aria-hidden="true" />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
