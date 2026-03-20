import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";

/*
 * Philippine Sunrise theme — custom theme for Likhenyo
 * Synthesized from Ocean Depths structure + Golden Hour amber + Botanical terracotta
 *
 * Display: Fraunces — variable-weight optical serif, extraordinary in italic bold
 * Wordmark: Plus Jakarta Sans — SE Asian design tradition, warm geometric
 * Body: Outfit — clean architectural sans, warm and readable
 */

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Likhenyo — Hire Any Skilled Professional in the Philippines",
  description:
    "Connect with verified Filipino professionals — engineers, developers, designers, and more. Post jobs or find work, all in one place.",
  keywords: [
    "freelance Philippines",
    "hire Filipino professionals",
    "Cebu freelancers",
    "Philippine marketplace",
  ],
  openGraph: {
    title: "Likhenyo — Creative Genius, Filipino-Made",
    description:
      "The structured platform for Philippine freelancers and clients. Verified. Trusted. Built for how Filipinos work.",
    locale: "en_PH",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plusJakarta.variable} ${outfit.variable}`}
    >
      <body className="min-h-full flex flex-col bg-lk-cream text-lk-navy antialiased font-body">
        {children}
      </body>
    </html>
  );
}
