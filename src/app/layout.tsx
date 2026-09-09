import type { Metadata } from "next";
import { Hanken_Grotesk, Scheherazade_New } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/services/trpc/client";
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

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.icop.info";
const DESCRIPTION =
  "Portland's only all-Muslim cemetery — a dignified, 100% Sunnah-compliant resting place dedicated exclusively to Muslims, and affordable to Sunni and Shia families alike. A subsidiary of the Islamic Center of Portland.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Muslim Cemetery of Portland — Islamic Burial in Portland, OR",
    template: "%s · Muslim Cemetery of Portland",
  },
  description: DESCRIPTION,
  applicationName: "Muslim Cemetery of Portland",
  keywords: [
    "Muslim cemetery Portland",
    "Islamic burial Portland Oregon",
    "Muslim funeral Portland",
    "Islamic Center of Portland",
    "Janazah Portland",
    "Sunnah-compliant burial",
    "Muslim graveyard Oregon",
    "MCOP",
  ],
  authors: [{ name: "Islamic Center of Portland" }],
  category: "Cemetery",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Muslim Cemetery of Portland",
    title: "Muslim Cemetery of Portland — Islamic Burial in Portland, OR",
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    images: [
      {
        url: "/assets/cemetery-2.jpg",
        width: 1024,
        height: 603,
        alt: "Muslim Cemetery of Portland grounds",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muslim Cemetery of Portland",
    description: DESCRIPTION,
    images: ["/assets/cemetery-2.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${hanken.variable} ${arabic.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <TRPCReactProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
