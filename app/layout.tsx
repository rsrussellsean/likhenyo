import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, Outfit, Manrope, Inter } from "next/font/google";
import "./globals.css";

/*
 * Likhenyo — Radiant Artisan design system
 *
 * Headline: Manrope — geometric, warm, editorial authority
 * Body/Labels: Inter — maximum readability, functional intelligence
 *
 * Legacy fonts kept for auth/dashboard pages:
 * Display: Fraunces | Wordmark: Plus Jakarta Sans | Body: Outfit
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

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
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
      className={`${fraunces.variable} ${plusJakarta.variable} ${outfit.variable} ${manrope.variable} ${inter.variable}`}
    >
      <body className="min-h-full flex flex-col bg-white text-lk-dark antialiased">
        {children}
      </body>
    </html>
  );
}
