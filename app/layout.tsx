import type { Metadata } from "next";
import "./globals.css";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const jet = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jet" });

export const metadata: Metadata = {
  title: "David Maimon — DeSci Terminal",
  description: "Builder at the edge of AI × Biology × DeSci. Duke CS/Stats/Comp Bio.",
  metadataBase: new URL("https://your-domain.com"),
  openGraph: {
    title: "DeSci Terminal",
    description: "AI × Biology × DeSci",
    url: "https://your-domain.com",
    siteName: "DeSci Terminal",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${space.variable} ${jet.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}

