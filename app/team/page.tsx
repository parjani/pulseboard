
import Navbar from "@/components/Navbar";
import TeamBoard from "@/components/TeamBoard";

export const metadata = {
  title: "Team Workspace | PulseBoard",
  description:
    "Review product feedback, prioritize ideas, and track progress with PulseBoard.",
};

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-[#0b0b14] text-white">
      <Navbar />

      <TeamBoard />

      <footer className="border-t border-white/[0.08] px-5 py-7 text-center">
        <p className="text-sm text-slate-500">
          Great teams turn feedback into progress.
        </p>
        <p className="mt-2 text-xs text-slate-600">
          © 2026 PulseBoard
        </p>
      </footer>
    </main>
  );
}
