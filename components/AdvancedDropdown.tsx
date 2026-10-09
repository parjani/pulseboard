
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

type DropdownOption = {
  value: string;
  label: string;
  description?: string;
  color?: string;
  background?: string;
};

type AdvancedDropdownProps = {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
  disabled?: boolean;
};

export default function AdvancedDropdown({
  value,
  options,
  onChange,
  ariaLabel,
  disabled = false,
}: AdvancedDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative w-full">
      <motion.button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        whileTap={{ scale: 0.99 }}
        className={`flex w-full items-center gap-3 rounded-xl border bg-[#0b0b14] px-3 py-2.5 text-left transition ${
          open
            ? "border-violet-400/50 ring-2 ring-violet-500/10"
            : "border-white/10 hover:border-white/20"
        } disabled:cursor-wait disabled:opacity-50`}
      >
        <span
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${
            selected?.background ?? "bg-violet-400/20"
          }`}
        />

        <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-100">
          {selected?.label ?? value}
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-180 text-violet-300" : ""
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            aria-label={ariaLabel}
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 min-w-full overflow-hidden rounded-xl border border-white/10 bg-[#151522] p-1.5 shadow-2xl shadow-black/50"
          >
            {options.map((option) => {
              const active = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                    active
                      ? "bg-violet-500/10"
                      : "hover:bg-white/[0.05]"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                      option.background ?? "bg-violet-400/30"
                    }`}
                  />

                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-sm ${
                        active
                          ? "font-medium text-violet-200"
                          : "text-slate-200"
                      }`}
                    >
                      {option.label}
                    </span>

                    {option.description && (
                      <span className="mt-0.5 block text-xs text-slate-500">
                        {option.description}
                      </span>
                    )}
                  </span>

                  {active && (
                    <Check className="h-4 w-4 shrink-0 text-violet-300" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
