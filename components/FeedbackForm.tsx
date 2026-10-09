
"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    CheckCircle2,
    Lightbulb,
    LoaderCircle,
    MessageSquarePlus,
    Send,
    Sparkles,
} from "lucide-react";

const categories = [
    { value: "Feature Request", label: "Feature Request", emoji: "💡" },
    { value: "Bug", label: "Bug Report", emoji: "🐛" },
    { value: "Improvement", label: "Improvement", emoji: "🚀" },
    { value: "Other", label: "Other", emoji: "💬" },
];

export default function FeedbackForm({
    onSubmitted,
}: {
    onSubmitted: () => void;
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Feature Request");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setSuccess(false);


        const cleanTitle = title.trim();
        const cleanDescription = description.trim();

        if (!cleanTitle) {
            setError("Please enter a feedback title.");
            return;
        }

        if (cleanTitle.length < 3 || cleanTitle.length > 100) {
            setError("Your title must contain between 3 and 100 characters.");
            return;
        }

        if (!cleanDescription) {
            setError("Please enter a feedback description.");
            return;
        }

        if (
            cleanDescription.length < 10 ||
            cleanDescription.length > 1000
        ) {
            setError(
                "Your description must contain between 10 and 1000 characters."
            );
            return;
        }


        setLoading(true);

        try {
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: cleanTitle,
                    description: cleanDescription,
                    category,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Unable to submit feedback.");
            }

            setTitle("");
            setDescription("");
            setCategory("Feature Request");
            setSuccess(true);
            onSubmitted();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <motion.section
            id="submit-feedback"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#11111d] p-5 shadow-2xl shadow-black/20 sm:p-8"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-600/15 blur-3xl"
            />

            <div className="relative">
                <div className="mb-6 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
                        <MessageSquarePlus className="h-6 w-6" />
                    </div>

                    <div>
                        <div className="mb-1 flex items-center gap-2">
                            <h2 className="text-xl font-semibold text-white sm:text-2xl">
                                Share your feedback
                            </h2>
                            <Sparkles className="hidden h-4 w-4 text-amber-300 sm:block" />
                        </div>
                        <p className="text-sm leading-6 text-slate-400">
                            Have an idea? We&apos;re listening. Tell us what could be better.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}  noValidate className="space-y-5">
                    <div>
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <label
                                htmlFor="feedback-title"
                                className="text-sm font-medium text-slate-200"
                            >
                                Feedback title
                            </label>
                            <span className="text-xs text-slate-500">
                                {title.length}/100
                            </span>
                        </div>

                        <input
                            id="feedback-title"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            maxLength={100}
                            minLength={3}
                            required
                            placeholder="e.g. Add dark mode to the dashboard"
                            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/10"
                        />
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <label
                                htmlFor="feedback-description"
                                className="text-sm font-medium text-slate-200"
                            >
                                Description
                            </label>
                            <span className="text-xs text-slate-500">
                                {description.length}/1000
                            </span>
                        </div>

                        <textarea
                            id="feedback-description"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            minLength={10}
                            maxLength={1000}
                            required
                            rows={5}
                            placeholder="Tell us more about your idea or the problem you've experienced..."
                            className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/10"
                        />
                    </div>

                    <fieldset>
                        <legend className="mb-3 text-sm font-medium text-slate-200">
                            Choose a category
                        </legend>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {categories.map((item) => {
                                const selected = category === item.value;

                                return (
                                    <button
                                        key={item.value}
                                        type="button"
                                        onClick={() => setCategory(item.value)}
                                        aria-pressed={selected}
                                        className={`flex min-h-20 flex-col items-start justify-center gap-2 rounded-xl border p-3 text-left transition-all duration-200 ${selected
                                                ? "border-violet-400/50 bg-violet-500/10 text-white ring-1 ring-violet-400/20"
                                                : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:bg-white/[0.05]"
                                            }`}
                                    >
                                        <span className="text-lg">{item.emoji}</span>
                                        <span className="text-xs font-medium sm:text-sm">
                                            {item.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </fieldset>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                role="alert"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
                            >
                                {error}
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                role="status"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
                            >
                                <CheckCircle2 className="h-5 w-5 shrink-0" />
                                Your feedback is in! Thanks for helping us improve.
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <p className="flex items-center gap-2 text-xs text-slate-500">
                            <Lightbulb className="h-4 w-4 text-amber-300" />
                            Every great idea starts somewhere.
                        </p>

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 font-medium text-white shadow-lg shadow-violet-600/20 transition-all hover:-translate-y-0.5 hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    Submit feedback
                                    <Send className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </motion.section>
    );
}
