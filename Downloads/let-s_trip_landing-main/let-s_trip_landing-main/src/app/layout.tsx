import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-pjs",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "LetsTrip | Where Wanderlust Meets Experience",
  description:
    "Curated luxury travel experiences to Thailand, Dubai, Singapore, Bali and beyond. Your personal AI travel concierge for unforgettable adventures.",
  keywords:
    "travel agency, luxury travel, Thailand packages, Dubai tours, Bali holidays, Singapore trips, travel concierge",
  openGraph: {
    title: "LetsTrip | Where Wanderlust Meets Experience",
    description:
      "Curated luxury travel experiences designed to make every moment extraordinary.",
    type: "website",
  },
};

import Chatbot from "@/components/Chatbot";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${plusJakartaSans.variable} antialiased`}
    >
      <body className="min-h-screen">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <Chatbot />
      </body>
    </html>
  );
}
