import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

/**
 * Without this, mobile Safari assumes a 980px layout viewport and scales the whole
 * page down: tap targets render below the 44px minimum and the tracking grids
 * overflow horizontally. `viewport-fit=cover` is what lets the safe-area padding
 * used further down the member shell do anything on a notched device.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBFBF9" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
};

export const metadata: Metadata = {
  title: "HerCompassAI — Navigate Menopause Together | Relationship & Wellness Intelligence",
  description:
    "A relationship-centered menopause wellness platform combining clinician-backed guidance and evidence-based AI to build predictability, connection, and confidence for women and their partners.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "HerCompassAI",
    statusBarStyle: "default",
  },
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
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col bg-[#FBFBF9] text-[#0F172A] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
