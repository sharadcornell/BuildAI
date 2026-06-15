import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://buildai.global"),
  title: {
    default: "BuildAI — We don't teach AI. We make engineers who ship.",
    template: "%s · BuildAI",
  },
  description:
    "A 13-week AI-native product engineering apprenticeship for India's engineering colleges. Students ship real products, reviewed by working engineers from AI startups.",
  openGraph: {
    title: "BuildAI — We make engineers who ship.",
    description:
      "13-week AI-native product engineering apprenticeship, run inside India's engineering colleges.",
    url: "https://buildai.global",
    siteName: "BuildAI",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable}`}>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
