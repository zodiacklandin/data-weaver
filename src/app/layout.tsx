import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Outfit, JetBrains_Mono } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from "@/app/providers/theme-provider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Rephoven | Curated Style Picks & Premium Products",
  description: "Discover handpicked premium products featured in our video reviews. Quality meets style at unbeatable prices. Shop the latest trends curated just for you.",
  keywords: ["fashion", "style", "curated products", "premium", "video reviews", "shopping"],
  authors: [{ name: "Rephoven" }],
  openGraph: {
    title: "Rephoven | Curated Style Picks & Premium Products",
    description: "Discover handpicked premium products featured in our video reviews.",
    type: "website",
    siteName: "Rephoven",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rephoven | Curated Style Picks",
    description: "Discover handpicked premium products featured in our video reviews.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${outfit.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
