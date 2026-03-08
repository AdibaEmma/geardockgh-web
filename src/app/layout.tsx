import type { Metadata } from "next";
import { Syne, DM_Sans, Space_Mono } from "next/font/google";
import { Providers } from "@/providers";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GearDockGH — Premium Gear for Remote Workers & Creators",
  description:
    "Premium imported gear for Ghana's remote workers, content creators, gamers, and students. Top-tier equipment. Delivered to your door.",
  openGraph: {
    title: "GearDockGH — Premium Gear for Remote Workers & Creators",
    description:
      "Premium imported gear for Ghana's remote workers, content creators, gamers, and students. Top-tier equipment. Delivered to your door.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${syne.variable} ${dmSans.variable} ${spaceMono.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
