
"use client";

import Link from "next/link";
import { Activity, LayoutDashboard, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0b14]/85 backdrop-blur-xl"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/25 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
            <Activity className="h-6 w-6 text-white" />
          </div>

          <div>
            <span className="text-lg font-bold tracking-tight text-white">
              Pulse<span className="text-violet-400">Board</span>
            </span>
            <p className="hidden text-[10px] tracking-[0.2em] text-slate-500 sm:block">
              PRODUCT FEEDBACK
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Feedback</span>
          </Link>

          <Link
            href="/team"
            className="flex items-center gap-2 rounded-xl border border-violet-400/20 bg-violet-500/10 px-3 py-2 text-sm text-violet-200 transition-all hover:border-violet-400/50 hover:bg-violet-500/20"
          >
            <Users className="h-4 w-4" />
            <span>Team space</span>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
