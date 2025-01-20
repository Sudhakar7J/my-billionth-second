import { Metadata } from "next";
import { BillionthCalculator } from "@/components/billionth-calculator";
import { TweetEmbed } from "@/components/tweet-embed";
import { Toaster } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

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

function PageSkeleton() {
  return (
    <div className="w-full max-w-xl border-2 bg-background/60 backdrop-blur-sm rounded-lg">
      <div className="p-6 md:p-8 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-5 w-2/3 mx-auto" />
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <Skeleton className="h-10 w-[70px]" />
            <Skeleton className="h-10 w-[70px]" />
            <Skeleton className="h-10 w-[90px]" />
            <Skeleton className="h-10 w-[70px]" />
            <Skeleton className="h-10 w-[70px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className="w-full flex justify-center order-2 lg:order-1">
              <div className="lg:sticky lg:top-8 w-full">
                <Suspense fallback={<PageSkeleton />}>
                  <BillionthCalculator />
                </Suspense>
              </div>
            </div>
            <div className="w-full flex justify-center order-1 lg:order-2">
              <div className="lg:sticky lg:top-8 w-full">
                <Suspense fallback={<PageSkeleton />}>
                  <TweetEmbed />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}
