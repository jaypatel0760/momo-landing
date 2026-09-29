import type { Metadata, Viewport } from "next";
import { Syne, Space_Grotesk } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "$MOMO — Enter the MOMO Dimension",
  description: "Explore a fictional futuristic universe combining digital collectibles, gaming and community.",
  keywords: ["crypto", "web3", "gaming", "digital collectibles", "metaverse", "fictional", "demo"],
  authors: [{ name: "MOMO Demo Project" }],
  creator: "MOMO Demo Project",
  publisher: "MOMO Demo Project",
  robots: "index, follow",
  openGraph: {
    title: "$MOMO — Enter the MOMO Dimension",
    description: "Explore a fictional futuristic universe combining digital collectibles, gaming and community.",
    type: "website",
    locale: "en_US",
    siteName: "$MOMO",
  },
  twitter: {
    card: "summary_large_image",
    title: "$MOMO — Enter the MOMO Dimension",
    description: "Explore a fictional futuristic universe combining digital collectibles, gaming and community.",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#030307",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}