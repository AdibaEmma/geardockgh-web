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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicons/geardockgh-favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/geardockgh-favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/geardockgh-favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicons/geardockgh-favicon-64x64.png", sizes: "64x64", type: "image/png" },
      { url: "/favicons/geardockgh-favicon-128x128.png", sizes: "128x128", type: "image/png" },
      { url: "/favicons/geardockgh-favicon-256x256.png", sizes: "256x256", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
  },
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('geardock-theme');var t=s?JSON.parse(s).state.theme:'dark';if(t==='system'){t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'}document.documentElement.classList.add(t)}catch(e){document.documentElement.classList.add('dark')}})()`,
          }}
        />
      </head>
      <body
        className={`${syne.variable} ${dmSans.variable} ${spaceMono.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
