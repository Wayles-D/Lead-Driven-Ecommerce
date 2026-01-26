import { Providers } from "./providers";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://omlsoles.ng"),
  title: {
    default: "OML Soles | Premium Handcrafted Shoes",
    template: "%s | OML Soles",
  },
  description: "Experience the soft feel your feet needs. Premium handcrafted shoes by OML Soles. Comfort meets elegance in every step.",
  keywords: ["handcrafted shoes", "premium footwear", "OML Soles", "luxury shoes Nigeria", "bespoke shoemaker"],
  authors: [{ name: "OML Soles" }],
  creator: "OML Soles",
  publisher: "OML Soles",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "https://res.cloudinary.com/dmb5ggmvg/image/upload/v1765226721/Brown_and_Beige_Modern_Aesthetic_Fashion_Store_Design_Logo_2_ladbpd.png",
    apple: "https://res.cloudinary.com/dmb5ggmvg/image/upload/v1765226721/Brown_and_Beige_Modern_Aesthetic_Fashion_Store_Design_Logo_2_ladbpd.png",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://omlsoles.ng",
    siteName: "OML Soles",
    title: "OML Soles | Premium Handcrafted Shoes",
    description: "Experience the soft feel your feet needs. Premium handcrafted shoes by OML Soles.",
    images: [
      {
        url: "https://res.cloudinary.com/dmb5ggmvg/image/upload/v1765226721/Brown_and_Beige_Modern_Aesthetic_Fashion_Store_Design_Logo_2_ladbpd.png",
        width: 1200,
        height: 630,
        alt: "OML Soles - Premium Handcrafted Shoes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OML Soles | Premium Handcrafted Shoes",
    description: "Experience the soft feel your feet needs. Premium handcrafted shoes by OML Soles.",
    images: ["https://res.cloudinary.com/dmb5ggmvg/image/upload/v1765226721/Brown_and_Beige_Modern_Aesthetic_Fashion_Store_Design_Logo_2_ladbpd.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { GoogleAnalytics } from "@/components/seo/GoogleAnalytics";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX"; // Fallback placeholder

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "OML Soles",
    "description": "Experience the soft feel your feet needs. Premium handcrafted shoes by OML Soles.",
    "url": "https://omlsoles.ng",
    "logo": "https://res.cloudinary.com/dmb5ggmvg/image/upload/v1765226721/Brown_and_Beige_Modern_Aesthetic_Fashion_Store_Design_Logo_2_ladbpd.png",
    "image": "https://res.cloudinary.com/dmb5ggmvg/image/upload/v1765226721/Brown_and_Beige_Modern_Aesthetic_Fashion_Store_Design_Logo_2_ladbpd.png",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "NG"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://omlsoles.ng/products?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased flex flex-col", inter.variable)}>
        {GA_ID !== "G-XXXXXXXXXX" && <GoogleAnalytics gaId={GA_ID} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
