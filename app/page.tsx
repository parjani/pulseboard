
"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, LoaderCircle } from "lucide-react";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeedbackForm from "@/components/FeedbackForm";
import FeedbackBoard from "@/components/FeedbackBoard";
import StatsOverview from "@/components/StatsOverview";
import type { FeedbackItem } from "@/components/FeedbackCard";

export default function HomePage() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const loadFeedback = useCallback(async () => {
    try {
      setError("");

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
          : "Unable to load feedback statistics."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFeedback();
  }, [loadFeedback, refreshKey]);

  const handleSubmitted = () => {
    setRefreshKey((current) => current + 1);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#0b0b14] text-white">
      <Navbar />

      <Hero />

      <StatsOverview feedback={feedback} />

      {error && (
        <div
          role="alert"
          className="mx-auto mb-6 flex max-w-7xl items-center gap-3 px-5 text-sm text-rose-300 lg:px-8"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setRefreshKey((current) => current + 1)}
            className="font-medium underline underline-offset-4"
          >
            Retry
          </button>
        </div>
      )}

      {loading && (
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-5 pb-6 text-sm text-slate-500 lg:px-8">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Loading community statistics...
        </div>
      )}

      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="min-w-0"
        >
          <FeedbackForm onSubmitted={handleSubmitted} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="min-w-0"
        >
          <FeedbackBoard key={refreshKey} />
        </motion.div>
      </section>

      <footer className="border-t border-white/[0.08] px-5 py-7 text-center">
        <p className="text-sm text-slate-500">
          Built with purpose. Improved by feedback.
        </p>
        <p className="mt-2 text-xs text-slate-600">
          © 2026 PulseBoard
        </p>
      </footer>
    </main>
  );
}
