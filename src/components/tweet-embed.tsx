"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import Script from "next/script";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

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
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const maxAttempts = 3;

  // Prevent hydration mismatch
  useLayoutEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setLoadAttempts(0);
  };

  useEffect(() => {
    if (!isMounted) return;

    const loadTweet = () => {
      if (window.twttr) {
        window.twttr.widgets.load();
        return true;
      }
      return false;
    };

    if (!isLoading && loadAttempts < maxAttempts) {
      const success = loadTweet();
      if (!success) {
        // Exponential backoff for retries
        const delay = Math.min(1000 * Math.pow(2, loadAttempts), 10000);
        const timer = setTimeout(() => {
          setLoadAttempts((prev) => prev + 1);
        }, delay);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, loadAttempts, isMounted]);

  if (!isMounted) {
    return <LoadingSkeleton />;
  }

  return (
    <Card className="w-full max-w-xl border-2 bg-background/60 backdrop-blur-sm">
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="afterInteractive"
        onLoad={() => setIsLoading(false)}
        onError={() => setLoadAttempts((prev) => prev + 1)}
      />
      <div className="w-full">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="relative w-full">
            <blockquote
              className="twitter-tweet"
              data-theme="dark"
              data-align="center"
              data-conversation="none"
              data-dnt="true"
            >
              <a href="https://twitter.com/MKBHD/status/1879281378422063328"></a>
            </blockquote>
            {loadAttempts >= maxAttempts && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-card/95 backdrop-blur-sm rounded-lg p-6">
                <p className="text-sm text-muted-foreground text-center">
                  Unable to load tweet. This could be due to:
                  <br />
                  • Slow internet connection
                  <br />
                  • X/Twitter being blocked in your region
                  <br />• Browser privacy settings
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

const LoadingSkeleton = () => (
  <div className="space-y-4 p-4 md:p-6">
    <Skeleton className="h-10 md:h-14 w-full" />
    <Skeleton className="h-32 md:h-40 w-full" />
    <div className="flex items-center space-x-4">
      <Skeleton className="h-10 md:h-12 w-10 md:w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-3 md:h-4 w-[200px] md:w-[250px]" />
        <Skeleton className="h-3 md:h-4 w-[150px] md:w-[200px]" />
      </div>
    </div>
  </div>
);
