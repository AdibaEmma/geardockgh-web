import type { Metadata } from "next";
import { Outfit, Rubik, Space_Mono } from "next/font/google";
import { Providers } from "@/providers";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { PageLoader } from "@/components/ui/PageLoader";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://geardockgh.com";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const rubik = Rubik({
  variable: "--font-rubik",
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GearDockGH — Premium Gear for Remote Workers & Creators",
    template: "%s | GearDockGH",
  },
  description:
    "Premium imported gear for Ghana's remote workers, content creators, gamers, and students. Verified imports, priced in cedis, 48h delivery. MoMo accepted.",
  keywords: [
    "buy tech gear Ghana",
    "premium gear Ghana",
    "remote work equipment Ghana",
    "MoMo online shopping Ghana",
    "headphones Ghana",
    "laptops Ghana",
    "gaming gear Ghana",
    "GearDockGH",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
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
      "Premium imported gear for Ghana's remote workers, content creators, gamers, and students. Verified imports, priced in cedis, 48h delivery.",
    type: "website",
    siteName: "GearDockGH",
    locale: "en_GH",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "GearDockGH — Premium Gear for Remote Workers & Creators",
    description:
      "Premium imported gear for Ghana's remote workers, content creators, and gamers. Verified imports, MoMo accepted, 48h delivery.",
  },
  alternates: {
    canonical: SITE_URL,
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
        className={`${outfit.variable} ${rubik.variable} ${spaceMono.variable} font-sans antialiased`}
      >
        <PageLoader />
        <OrganizationJsonLd />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
