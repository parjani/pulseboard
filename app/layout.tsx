
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PulseBoard — Your Voice Shapes What We Build",
    template: "%s | PulseBoard",
  },
  description:
    "Share product ideas, report bugs, and track improvements with PulseBoard — a modern community feedback board.",
  applicationName: "PulseBoard",
  keywords: [
    "feedback board",
    "product feedback",
    "feature requests",
    "bug reports",
    "product roadmap",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0b14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
