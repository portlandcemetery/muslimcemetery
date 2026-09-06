import type { Metadata } from "next";
import { Hanken_Grotesk, Scheherazade_New } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const arabic = Scheherazade_New({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Islamic Center of Portland — Memorial Gardens",
  description:
    "A dignified, Sunnah-compliant final resting place, tended with prayer, transparency, and lasting care for every family we serve.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${hanken.variable} ${arabic.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster />
      </body>
    </html>
  );
}
