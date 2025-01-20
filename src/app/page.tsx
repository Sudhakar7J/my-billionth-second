import { BillionthCalculator } from "@/components/billionth-calculator";
import { TweetEmbed } from "@/components/tweet-embed";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8 md:py-16 min-h-screen">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Billionth Second
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover the exact moment you&apos;ll reach one billion seconds of
            life. A unique milestone worth celebrating.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="flex justify-center">
            <BillionthCalculator />
          </div>
          <div className="flex justify-center md:sticky md:top-8">
            <TweetEmbed />
          </div>
        </div>

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>
            Built with Next.js and Tailwind CSS. Inspired by the concept of
            celebrating unique life milestones.
          </p>
        </footer>
      </div>
    </main>
  );
}
