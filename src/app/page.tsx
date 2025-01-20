import { Metadata } from "next";
import { BillionthCalculator } from "@/components/billionth-calculator";
import { TweetEmbed } from "@/components/tweet-embed";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Billionth Second Calculator",
  description:
    "Discover when you'll reach your billionth second of life - a unique milestone worth celebrating.",
  openGraph: {
    title: "Billionth Second Calculator",
    description:
      "Discover when you'll reach your billionth second of life - a unique milestone worth celebrating.",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 md:py-16">
          <div className="max-w-2xl mx-auto text-center mb-8 md:mb-12">
            <h1 className="scroll-m-20 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              Billionth Second
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-prose mx-auto">
              Discover the exact moment you&apos;ll reach one billion seconds of
              life. A unique milestone worth celebrating.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
            <div className="w-full flex justify-center order-2 lg:order-1">
              <BillionthCalculator />
            </div>
            <div className="w-full flex justify-center lg:sticky lg:top-8 order-1 lg:order-2">
              <TweetEmbed />
            </div>
          </div>
        </div>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}
