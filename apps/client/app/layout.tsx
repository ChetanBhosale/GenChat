import type { Metadata } from "next";
import {Mulish} from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

// const inter = Inter({
//   variable: "--font-inter",
//   subsets: ["latin"],
//   display: "swap",
// });

// const outfit = Outfit({
//   variable: "--font-outfit",
//   subsets: ["latin"],
//   display: "swap",
// });

// const jetbrainsMono = JetBrains_Mono({
//   variable: "--font-jetbrains-mono",
//   subsets: ["latin"],
//   display: "swap",
// });

const mulish = Mulish({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mulish",
});

export const metadata: Metadata = {
  title: "Finix - AI Chatbot Builder | Create Custom Chatbots in Minutes",
  description: "Build powerful AI chatbots and agents for your website in just minutes. No coding required. Boost customer engagement, automate support, and increase conversions with our intelligent chatbot platform.",
  keywords: [
    "AI chatbot",
    "chatbot builder",
    "website chatbot",
    "AI agents",
    "customer support automation",
    "conversational AI",
    "chatbot platform",
    "no-code chatbot",
    "website integration",
    "intelligent chatbot",
    "automated customer service",
    "chatbot creation tool"
  ],
  authors: [{ name: "Finix Team" }],
  creator: "Finix",
  publisher: "Finix",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://finix.ai",
    siteName: "Finix",
    title: "Finix - AI Chatbot Builder | Create Custom Chatbots in Minutes",
    description: "Build powerful AI chatbots and agents for your website in just minutes. No coding required. Boost customer engagement and automate support.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Finix - AI Chatbot Builder Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Finix - AI Chatbot Builder | Create Custom Chatbots in Minutes",
    description: "Build powerful AI chatbots and agents for your website in just minutes. No coding required.",
    images: ["/twitter-image.jpg"],
    creator: "@finix",
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://finix.ai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" className="dark">
      <body
      className={`${mulish.variable} font-mulish dark bg-background text-foreground`}
      >
          <Toaster position="bottom-right" />
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
