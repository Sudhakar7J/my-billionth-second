"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { Skeleton } from "@/components/ui/skeleton";

interface TwitterWidgets {
  load: () => void;
}

interface TwitterObject {
  widgets: TwitterWidgets;
}

declare global {
  interface Window {
    twttr: TwitterObject;
  }
}

export function TweetEmbed() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTweet = () => {
      if (window.twttr) {
        window.twttr.widgets.load();
      }
    };

    if (!isLoading) {
      loadTweet();
      // Retry a few times in case the widget doesn't load immediately
      const retryTimes = [100, 500, 1000, 2000];
      retryTimes.forEach((delay) => {
        setTimeout(loadTweet, delay);
      });
    }
  }, [isLoading]);

  return (
    <>
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="afterInteractive"
        onLoad={() => setIsLoading(false)}
      />
      <div className="flex justify-center w-full min-h-[500px] items-start">
        {isLoading ? (
          <div className="w-full max-w-[550px] space-y-4 p-6 border rounded-xl bg-card">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-40 w-full" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </div>
        ) : (
          <blockquote
            className="twitter-tweet"
            data-theme="dark"
            data-align="center"
          >
            <a href="https://twitter.com/MKBHD/status/1879281378422063328?ref_src=twsrc%5Etfw"></a>
          </blockquote>
        )}
      </div>
    </>
  );
}
