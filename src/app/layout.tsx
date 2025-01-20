import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MovingGradientBackground } from "@/components/ui/moving-gradient-background";
import { Footer } from "@/components/ui/footer";
import "./globals.css";
import { Analytics } from "@/components/analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Billionth Second",
  description:
    "Celebrate your billionth second of life with this beautiful calculator",
  openGraph: {
    title: "My Billionth Second",
    description: "Celebrate your billionth second of life",
    type: "website",
  },
  icons: {
    icon: "../../public/asset/icons/favicon_clock.jpeg",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <MovingGradientBackground className="fixed inset-0" />
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
