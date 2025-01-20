"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import Script from "next/script";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

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
  const maxAttempts = 5;

  // Prevent hydration mismatch
  useLayoutEffect(() => {
    setIsMounted(true);
  }, []);

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
    <>
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="afterInteractive"
        onLoad={() => setIsLoading(false)}
        onError={() => setLoadAttempts((prev) => prev + 1)}
      />
      <div className="w-full max-w-[550px] min-h-[250px] md:min-h-[500px]">
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
              <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm rounded-lg">
                <p className="text-sm text-muted-foreground text-center px-4">
                  Unable to load tweet. Please check your connection and refresh
                  the page.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

const LoadingSkeleton = () => (
  <Card className="w-full space-y-4 p-4 md:p-6">
    <Skeleton className="h-10 md:h-14 w-full" />
    <Skeleton className="h-32 md:h-40 w-full" />
    <div className="flex items-center space-x-4">
      <Skeleton className="h-10 md:h-12 w-10 md:w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-3 md:h-4 w-[200px] md:w-[250px]" />
        <Skeleton className="h-3 md:h-4 w-[150px] md:w-[200px]" />
      </div>
    </div>
  </Card>
);
