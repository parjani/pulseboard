
"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  CircleDot,
  ClipboardList,
  Lightbulb,
  TrendingUp,
} from "lucide-react";
import type { FeedbackItem } from "./FeedbackCard";

type StatsOverviewProps = {
  feedback: FeedbackItem[];
};

export default function StatsOverview({
  feedback,
}: StatsOverviewProps) {
  const stats = [
    {
      label: "Total ideas",
      value: feedback.length,
      description: "Community submissions",
      icon: Lightbulb,
      iconStyle: "bg-violet-500/10 text-violet-300",
      accent: "from-violet-500/20",
    },
    {
      label: "New feedback",
      value: feedback.filter((item) => item.status === "New").length,
      description: "Fresh ideas to review",
      icon: CircleDot,
      iconStyle: "bg-blue-500/10 text-blue-300",
      accent: "from-blue-500/20",
    },
    {
      label: "Planned",
      value: feedback.filter((item) => item.status === "Planned").length,
      description: "On the roadmap",
      icon: ClipboardList,
      iconStyle: "bg-amber-500/10 text-amber-300",
      accent: "from-amber-500/20",
    },
    {
      label: "Completed",
      value: feedback.filter((item) => item.status === "Done").length,
      description: "Ideas brought to life",
      icon: CheckCircle2,
      iconStyle: "bg-emerald-500/10 text-emerald-300",
      accent: "from-emerald-500/20",
    },
  ];

  return (
    <section
      aria-label="Feedback statistics"
      className="mx-auto w-full max-w-7xl px-5 pb-10 lg:px-8"
    >
      <div className="mb-5 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-violet-300" />
        <p className="text-sm font-medium text-slate-300">
          The community at a glance
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
              }}
              className={`relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br ${stat.accent} to-[#11111d] p-5`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-400">
                    {stat.label}
                  </p>

                  <motion.p
                    key={stat.value}
                    initial={{ opacity: 0.5, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-3xl font-bold tracking-tight text-white"
                  >
                    {stat.value}
                  </motion.p>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconStyle}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-500">
                {stat.description}
              </p>

              <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width:
                      feedback.length > 0
                        ? `${Math.max(
                            8,
                            (stat.value / feedback.length) * 100
                          )}%`
                        : "0%",
                  }}
                  transition={{ duration: 0.7, delay: index * 0.08 }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
