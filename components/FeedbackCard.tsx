
"use client";

import { motion } from "framer-motion";
import {
  Bug,
  CheckCircle2,
  Clock3,
  Lightbulb,
  MessageCircle,
  Rocket,
  Sparkles,
} from "lucide-react";

export type FeedbackItem = {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: "New" | "Planned" | "Done";
  createdAt: string;
};

const categoryConfig: Record<
  string,
  { icon: typeof Lightbulb; color: string; label: string }
> = {
  "Feature Request": {
    icon: Lightbulb,
    color: "text-amber-300 bg-amber-400/10 border-amber-400/20",
    label: "Feature request",
  },
  Bug: {
    icon: Bug,
    color: "text-rose-300 bg-rose-400/10 border-rose-400/20",
    label: "Bug report",
  },
  Improvement: {
    icon: Rocket,
    color: "text-sky-300 bg-sky-400/10 border-sky-400/20",
    label: "Improvement",
  },
  Other: {
    icon: MessageCircle,
    color: "text-violet-300 bg-violet-400/10 border-violet-400/20",
    label: "Other",
  },
};

const statusConfig = {
  New: {
    icon: Sparkles,
    color: "text-violet-300 bg-violet-400/10",
  },
  Planned: {
    icon: Clock3,
    color: "text-sky-300 bg-sky-400/10",
  },
  Done: {
    icon: CheckCircle2,
    color: "text-emerald-300 bg-emerald-400/10",
  },
};

export default function FeedbackCard({
  feedback,
  index = 0,
}: {
  feedback: FeedbackItem;
  index?: number;
}) {
  const category =
    categoryConfig[feedback.category] ?? categoryConfig.Other;
  const status = statusConfig[feedback.status] ?? statusConfig.New;
  const CategoryIcon = category.icon;
  const StatusIcon = status.icon;

  const formattedDate = new Date(feedback.createdAt).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.25) }}
      whileHover={{ y: -3 }}
      className="group rounded-2xl border border-white/[0.08] bg-[#11111d] p-5 transition-colors duration-300 hover:border-violet-400/30 hover:bg-[#151523]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium ${category.color}`}
        >
          <CategoryIcon className="h-3.5 w-3.5" />
          {category.label}
        </span>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          {feedback.status}
        </span>
      </div>

      <h3 className="mt-4 text-base font-semibold leading-6 text-white transition-colors group-hover:text-violet-200">
        {feedback.title}
      </h3>

      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-400">
        {feedback.description}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
        <span className="text-xs text-slate-500">
          Submitted {formattedDate}
        </span>

        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Community idea
        </span>
      </div>
    </motion.article>
  );
}
