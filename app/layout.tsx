import type { Metadata } from "next";
import "./globals.css";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const jet = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jet" });

export const metadata: Metadata = {
  title: "David Maimon — Terminal",
  description: "Builder at the edge of C. Duke CS/Math",
  metadataBase: new URL("https://your-domain.com"),
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96" },
    ],
    shortcut: ["/favicon/favicon.ico"],
    apple: ["/favicon/apple-touch-icon.png"],
  },
  manifest: "/favicon/site.webmanifest",
  openGraph: {
    title: "Terminal",
    description: "ZK-proofs × Verifiable Inference",
    url: "https://your-domain.com",
    siteName: "Terminal",
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

