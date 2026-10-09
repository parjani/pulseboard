
"use client";


import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertCircle,
    ArrowUpDown,
    Bug,
    Check,
    ChevronDown,
    Inbox,
    Lightbulb,
    MessageSquare,
    RefreshCw,
    Rocket,
    Search,
    SlidersHorizontal,
    X,
} from "lucide-react";

import FeedbackCard, { type FeedbackItem } from "./FeedbackCard";


const categories = [
    {
        value: "All categories",
        label: "All categories",
        description: "Explore every idea",
        icon: SlidersHorizontal,
        color: "text-violet-300",
        background: "bg-violet-500/15",
    },
    {
        value: "Feature Request",
        label: "Feature Request",
        description: "New ideas and features",
        icon: Lightbulb,
        color: "text-amber-300",
        background: "bg-amber-500/15",
    },
    {
        value: "Bug",
        label: "Bug Report",
        description: "Issues to investigate",
        icon: Bug,
        color: "text-rose-300",
        background: "bg-rose-500/15",
    },
    {
        value: "Improvement",
        label: "Improvement",
        description: "Make things even better",
        icon: Rocket,
        color: "text-emerald-300",
        background: "bg-emerald-500/15",
    },
    {
        value: "Other",
        label: "Other",
        description: "Everything else",
        icon: MessageSquare,
        color: "text-sky-300",
        background: "bg-sky-500/15",
    },
];


export default function FeedbackBoard() {
    const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All categories");

    const [categoryOpen, setCategoryOpen] = useState(false);
    const categoryDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleOutsideClick(event: MouseEvent) {
            if (
                categoryDropdownRef.current &&
                !categoryDropdownRef.current.contains(event.target as Node)
            ) {
                setCategoryOpen(false);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setCategoryOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const selectedCategory =
        categories.find((item) => item.value === category) ?? categories[0];


    const fetchFeedback = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/feedback", {
                cache: "no-store",
            });
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Unable to load feedback.");
            }

            setFeedback(result.feedback as FeedbackItem[]);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong while loading feedback."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchFeedback();
    }, [fetchFeedback]);

    const filteredFeedback = useMemo(() => {
        const query = search.trim().toLowerCase();

        return feedback.filter((item) => {
            const matchesCategory =
                category === "All categories" || item.category === category;

            const matchesSearch =
                !query ||
                item.title.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query);

            return matchesCategory && matchesSearch;
        });
    }, [feedback, search, category]);

    return (
        <section id="feedback-board" className="scroll-mt-28">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-sm text-violet-300">
                        <MessageSquare className="h-4 w-4" />
                        Community ideas
                    </div>

                    <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        Feedback board
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                        Explore ideas, report issues, and help us improve.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => void fetchFeedback()}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.07] disabled:opacity-50 sm:self-auto"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                    Refresh
                </button>
            </div>

            <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_220px]">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search feedback..."
                        aria-label="Search feedback"
                        className="w-full rounded-xl border border-white/10 bg-[#11111d] py-3 pl-11 pr-10 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/50"
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            aria-label="Clear search"
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>


                <div ref={categoryDropdownRef} className="relative z-20">
                    <motion.button
                        type="button"
                        aria-haspopup="listbox"
                        aria-expanded={categoryOpen}
                        onClick={() => setCategoryOpen((open) => !open)}
                        whileTap={{ scale: 0.99 }}
                        className={`group flex w-full items-center gap-3 rounded-xl border bg-[#11111d] px-3 py-3 text-left transition-all duration-200 ${categoryOpen
                                ? "border-violet-400/50 ring-2 ring-violet-500/10"
                                : "border-white/10 hover:border-white/20"
                            }`}
                    >
                        <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${selectedCategory.background} ${selectedCategory.color}`}
                        >
                            <selectedCategory.icon className="h-4 w-4" />
                        </span>

                        <span className="min-w-0 flex-1">
                            <span className="block text-[10px] font-medium uppercase tracking-[0.15em] text-slate-500">
                                Filter by
                            </span>
                            <span className="block truncate text-sm font-medium text-white">
                                {selectedCategory.label}
                            </span>
                        </span>

                        <ChevronDown
                            className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${categoryOpen ? "rotate-180 text-violet-300" : ""
                                }`}
                        />
                    </motion.button>

                    <AnimatePresence>
                        {categoryOpen && (
                            <motion.div
                                role="listbox"
                                aria-label="Feedback categories"
                                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                                animate={{ opacity: 1, y: 6, scale: 1 }}
                                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                                transition={{ duration: 0.16 }}
                                className="absolute left-0 right-0 top-full z-50 overflow-hidden rounded-2xl border border-white/10 bg-[#151522] p-2 shadow-2xl shadow-black/50"
                            >
                                <div className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                    Choose a category
                                </div>

                                <div className="space-y-1">
                                    {categories.map((item) => {
                                        const Icon = item.icon;
                                        const selected = category === item.value;

                                        return (
                                            <button
                                                key={item.value}
                                                type="button"
                                                role="option"
                                                aria-selected={selected}
                                                onClick={() => {
                                                    setCategory(item.value);
                                                    setCategoryOpen(false);
                                                }}
                                                className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors ${selected
                                                        ? "bg-violet-500/10"
                                                        : "hover:bg-white/[0.05]"
                                                    }`}
                                            >
                                                <span
                                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.background} ${item.color}`}
                                                >
                                                    <Icon className="h-[14px] w-[14px]" />
                                                </span>

                                                <span className="min-w-0 flex-1">
                                                    <span
                                                        className={`block text-sm font-medium ${selected ? "text-violet-200" : "text-slate-200"
                                                            }`}
                                                    >
                                                        {item.label}
                                                    </span>
                                                    {/* <span className="mt-0.5 block text-xs text-slate-500">
                                                        {item.description}
                                                    </span> */}
                                                </span>

                                                {selected && (
                                                    <Check className="h-4 w-4 shrink-0 text-violet-300" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>

            <div className="mb-4 flex items-center justify-between text-sm">
                <p className="text-slate-400">
                    <span className="font-semibold text-white">
                        {filteredFeedback.length}
                    </span>{" "}
                    {filteredFeedback.length === 1 ? "idea" : "ideas"}
                    {search || category !== "All categories" ? " found" : " shared"}
                </p>

                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                    <ArrowUpDown className="h-3.5 w-3.5" />
                    Newest first
                </span>
            </div>

            {error && (
                <div
                    role="alert"
                    className="mb-5 flex flex-col gap-3 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div className="flex items-start gap-3 text-sm text-rose-200">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                        <p>{error}</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => void fetchFeedback()}
                        className="self-start rounded-lg border border-rose-300/20 px-3 py-2 text-sm text-rose-100 hover:bg-rose-500/10"
                    >
                        Try again
                    </button>
                </div>
            )}

            {loading ? (
                <div
                    aria-label="Loading feedback"
                    className="grid gap-4 md:grid-cols-2"
                >
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="animate-pulse rounded-2xl border border-white/[0.08] bg-[#11111d] p-5"
                        >
                            <div className="h-6 w-32 rounded-lg bg-white/10" />
                            <div className="mt-5 h-5 w-3/4 rounded bg-white/10" />
                            <div className="mt-3 h-4 w-full rounded bg-white/[0.06]" />
                            <div className="mt-2 h-4 w-2/3 rounded bg-white/[0.06]" />
                            <div className="mt-6 h-4 w-28 rounded bg-white/[0.06]" />
                        </div>
                    ))}
                </div>
            ) : !error && filteredFeedback.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-5 py-14 text-center"
                >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
                        <Inbox className="h-7 w-7" />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-white">
                        {search || category !== "All categories"
                            ? "No matching feedback"
                            : "Be the first to share an idea"}
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                        {search || category !== "All categories"
                            ? "Try another search term or change the category filter."
                            : "Every great product starts with a conversation. Share your first suggestion and help shape what comes next."}
                    </p>

                    {(search || category !== "All categories") && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setCategory("All categories");
                            }}
                            className="mt-5 rounded-xl bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-500/20"
                        >
                            Clear filters
                        </button>
                    )}
                </motion.div>
            ) : !error ? (
                <AnimatePresence mode="popLayout">
                    <div className="grid gap-4 md:grid-cols-2">
                        {filteredFeedback.map((item, index) => (
                            <FeedbackCard
                                key={item._id}
                                feedback={item}
                                index={index}
                            />
                        ))}
                    </div>
                </AnimatePresence>
            ) : null}
        </section>
    );
}
