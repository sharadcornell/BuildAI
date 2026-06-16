import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../styles/index.css";
import { Navbar } from "./components/buildai/Navbar";
import { Footer } from "./components/buildai/Footer";
import { CohortStatusStrip } from "./components/buildai/cards";
import { ScrollToTop } from "./components/buildai/ScrollToTop";

export const metadata: Metadata = {
  title: "User request",
  description:
    "Streamline your workflow with an intuitive tool designed to enhance productivity and simplify task management for professionals and teams.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col bg-paper text-foreground">
          <ScrollToTop />
          <CohortStatusStrip />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
