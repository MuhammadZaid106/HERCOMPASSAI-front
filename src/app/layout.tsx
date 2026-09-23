import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HerCompassAI — Navigate Menopause Together | Relationship & Wellness Intelligence",
  description:
    "A relationship-centered menopause wellness platform combining clinician-backed guidance and evidence-based AI to build predictability, connection, and confidence for women and their partners.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#FBFBF9] text-[#0F172A] antialiased">
        {children}
      </body>
    </html>
  );
}
