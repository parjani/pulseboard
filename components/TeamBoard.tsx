
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    CircleDot,
    ClipboardList,
    LoaderCircle,
    RefreshCw,
    Search,
    ShieldCheck,
    Check,
    ChevronDown,

} from "lucide-react";
import type { FeedbackItem } from "./FeedbackCard";
import AdvancedDropdown from "./AdvancedDropdown";

const statuses = ["New", "Planned", "Done"] as const;

const statusStyles = {
    New: "border-blue-400/20 bg-blue-400/10 text-blue-300",
    Planned: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    Done: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
};


const statusOptions = [
    {
        value: "All",
        label: "All statuses",
        description: "View every submission",
        background: "bg-violet-400",
    },
    {
        value: "New",
        label: "New",
        description: "Needs review",
        background: "bg-blue-400",
    },
    {
        value: "Planned",
        label: "Planned",
        description: "Scheduled for work",
        background: "bg-amber-400",
    },
    {
        value: "Done",
        label: "Done",
        description: "Completed feedback",
        background: "bg-emerald-400",
    },
];


export default function TeamBoard() {
    const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const loadFeedback = useCallback(async () => {
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
                    : "Unable to load the team board."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadFeedback();
    }, [loadFeedback]);

    const updateStatus = async (
        id: string,
        nextStatus: (typeof statuses)[number]
    ) => {
        const currentItem = feedback.find((item) => item._id === id);

        if (!currentItem || currentItem.status === nextStatus) return;

        setUpdatingId(id);
        setError("");
        setNotice("");

        try {
            const response = await fetch(`/api/feedback/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: nextStatus }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Unable to update status.");
            }

            setFeedback((current) =>
                current.map((item) =>
                    item._id === id ? { ...item, status: nextStatus } : item
                )
            );

            setNotice(`Status updated to ${nextStatus}.`);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to update the feedback status."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredFeedback = feedback.filter((item) => {
        const query = search.trim().toLowerCase();

        const matchesSearch =
            !query ||
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query);

        const matchesStatus =
            statusFilter === "All" || item.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const counts = {
        All: feedback.length,
        New: feedback.filter((item) => item.status === "New").length,
        Planned: feedback.filter((item) => item.status === "Planned").length,
        Done: feedback.filter((item) => item.status === "Done").length,
    };

    return (
        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-200">
                    <ShieldCheck className="h-4 w-4" />
                    Team workspace
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Turn feedback into{" "}
                    <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                        progress.
                    </span>
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                    Review what people are asking for, prioritize improvements, and
                    track every idea from submission to completion.
                </p>
            </motion.div>

            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                    {
                        label: "All feedback",
                        value: counts.All,
                        icon: ClipboardList,
                        style: "text-violet-300 bg-violet-500/10",
                    },
                    {
                        label: "New",
                        value: counts.New,
                        icon: CircleDot,
                        style: "text-blue-300 bg-blue-500/10",
                    },
                    {
                        label: "Planned",
                        value: counts.Planned,
                        icon: ArrowRight,
                        style: "text-amber-300 bg-amber-500/10",
                    },
                    {
                        label: "Completed",
                        value: counts.Done,
                        icon: CheckCircle2,
                        style: "text-emerald-300 bg-emerald-500/10",
                    },
                ].map((stat, index) => {
                    const Icon = stat.icon;

                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.06 }}
                            className="rounded-2xl border border-white/[0.08] bg-[#11111d] p-4 sm:p-5"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs text-slate-400 sm:text-sm">
                                    {stat.label}
                                </span>
                                <span
                                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.style}`}
                                >
                                    <Icon className="h-4 w-4" />
                                </span>
                            </div>

                            <p className="mt-3 text-2xl font-bold text-white">
                                {stat.value}
                            </p>
                        </motion.div>
                    );
                })}
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#11111d]">
                <div className="border-b border-white/[0.08] p-4 sm:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Feedback management
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Update the status of each submission.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => void loadFeedback()}
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                            />
                            Refresh
                        </button>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search submissions..."
                                aria-label="Search submissions"
                                className="w-full rounded-xl border border-white/10 bg-[#0b0b14] py-2.5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400/50"
                            />
                        </div>


                        <div className="w-full sm:w-56">
                            <AdvancedDropdown
                                value={statusFilter}
                                options={statusOptions}
                                onChange={setStatusFilter}
                                ariaLabel="Filter by status"
                            />
                        </div>

                    
                </div>
            </div>

            {(error || notice) && (
                <div
                    role={error ? "alert" : "status"}
                    className={`m-4 flex items-start gap-2 rounded-xl border p-3 text-sm ${error
                            ? "border-rose-400/20 bg-rose-500/10 text-rose-200"
                            : "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
                        }`}
                >
                    {error && <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
                    <p>{error || notice}</p>
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center gap-3 px-5 py-16 text-sm text-slate-400">
                    <LoaderCircle className="h-5 w-5 animate-spin text-violet-300" />
                    Loading feedback...
                </div>
            ) : filteredFeedback.length === 0 ? (
                <div className="px-5 py-16 text-center">
                    <ClipboardList className="mx-auto h-9 w-9 text-slate-600" />
                    <h3 className="mt-4 font-semibold text-white">
                        No feedback found
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                        Try another search or status filter.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-white/[0.06]">
                    <AnimatePresence initial={false}>
                        {filteredFeedback.map((item) => (
                            <motion.article
                                key={item._id}
                                layout
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="p-4 sm:p-5"
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-2 flex flex-wrap items-center gap-2">
                                            <span className="rounded-lg border border-violet-400/20 bg-violet-500/10 px-2.5 py-1 text-xs text-violet-200">
                                                {item.category}
                                            </span>

                                            <span
                                                className={`rounded-lg border px-2.5 py-1 text-xs ${statusStyles[item.status]}`}
                                            >
                                                {item.status}
                                            </span>
                                        </div>

                                        <h3 className="break-words font-semibold text-white">
                                            {item.title}
                                        </h3>

                                        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-400">
                                            {item.description}
                                        </p>

                                        <p className="mt-3 text-xs text-slate-600">
                                            Submitted{" "}
                                            {new Date(item.createdAt).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )}
                                        </p>
                                    </div>

                                    <div className="w-full shrink-0 lg:w-44">
                                        <label
                                            htmlFor={`status-${item._id}`}
                                            className="mb-2 block text-xs font-medium text-slate-400"
                                        >
                                            Update status
                                        </label>


                                        <AdvancedDropdown
                                            value={item.status}
                                            options={statusOptions.filter((option) => option.value !== "All")}
                                            onChange={(value) =>
                                                void updateStatus(
                                                    item._id,
                                                    value as (typeof statuses)[number]
                                                )
                                            }
                                            ariaLabel={`Update status for ${item.title}`}
                                            disabled={updatingId === item._id}
                                        />

                                        {updatingId === item._id && (
                                            <p className="mt-2 flex items-center gap-1.5 text-xs text-violet-300">
                                                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                                                Saving change...
                                            </p>
                                        )}


                                        {updatingId === item._id && (
                                            <p className="mt-2 flex items-center gap-1.5 text-xs text-violet-300">
                                                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                                                Saving change...
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    </div >
  );
}
