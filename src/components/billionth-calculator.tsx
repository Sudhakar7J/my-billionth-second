"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { format, getDaysInMonth } from "date-fns";
import { Clock, Calendar, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import * as htmlToImage from "html-to-image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TwitterIcon,
  FacebookIcon,
  LinkedInIcon,
} from "@/components/ui/social-icons";

const BILLION_SECONDS = 1000000000;
const BILLION_MILLISECONDS = BILLION_SECONDS * 1000;

// Helper function to get ordinal suffix
const getOrdinal = (n: number): string => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export function BillionthCalculator() {
  const [isMounted, setIsMounted] = useState(false);
  const [month, setMonth] = useState<number>();
  const [year, setYear] = useState<number>();
  const [day, setDay] = useState<number>();
  const [hour, setHour] = useState<number>();
  const [minute, setMinute] = useState<number>();
  const [billionthSecond, setBillionthSecond] = useState<Date>();
  const [nextBillionthSecond, setNextBillionthSecond] = useState<Date>();
  const [timeLeft, setTimeLeft] = useState<string>();
  const [progress, setProgress] = useState<number>(0);
  const [hasPassed, setHasPassed] = useState(false);
  const [currentBillion, setCurrentBillion] = useState<number>(1);
  const [previousMilestones, setPreviousMilestones] = useState<Date[]>([]);
  const milestoneRef = useRef<HTMLDivElement>(null);

  // Prevent hydration mismatch
  useLayoutEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate a reasonable year range
  const currentYear = new Date().getFullYear();
  const oldestReasonableAge = 120; // Oldest reasonable age to calculate for
  const fromYear = currentYear - oldestReasonableAge;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: currentYear - fromYear + 1 },
    (_, i) => currentYear - i
  );

  // Generate days array based on month and year
  const getDays = () => {
    if (month !== undefined && year !== undefined) {
      const numDays = getDaysInMonth(new Date(year, month));
      return Array.from({ length: numDays }, (_, i) => i + 1);
    }
    return Array.from({ length: 31 }, (_, i) => i + 1); // Default to 31 days
  };

  // Generate hours array (00-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Generate minutes array (00-59)
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // Validate and adjust day if needed when month/year changes
  useEffect(() => {
    if (month !== undefined && year !== undefined && day !== undefined) {
      const maxDays = getDaysInMonth(new Date(year, month));
      if (day > maxDays) {
        setDay(maxDays);
      }
    }
  }, [month, year, day]);

  const calculateProgress = (birthDate: Date) => {
    const now = new Date();
    const elapsed = now.getTime() - birthDate.getTime();

    // Calculate which billionth second we're working towards
    const billionsPassed = Math.floor(elapsed / BILLION_MILLISECONDS);
    const currentBillionStart = new Date(
      birthDate.getTime() + billionsPassed * BILLION_MILLISECONDS
    );
    const nextBillionDate = new Date(
      currentBillionStart.getTime() + BILLION_MILLISECONDS
    );

    // Calculate all previous milestones
    if (billionsPassed > 0) {
      const milestones = Array.from({ length: billionsPassed }, (_, i) => {
        return new Date(birthDate.getTime() + (i + 1) * BILLION_MILLISECONDS);
      });
      setPreviousMilestones(milestones);
    } else {
      setPreviousMilestones([]);
    }

    // Calculate progress to next billion
    const currentProgress =
      ((now.getTime() - currentBillionStart.getTime()) / BILLION_MILLISECONDS) *
      100;

    setHasPassed(billionsPassed > 0);
    setCurrentBillion(billionsPassed + 1);

    if (billionsPassed > 0) {
      setNextBillionthSecond(nextBillionDate);
    }

    return Math.min(Math.max(currentProgress, 0), 100);
  };

  const calculateBillionthSecond = (
    month: number,
    year: number,
    day: number,
    hour: number = 0,
    minute: number = 0
  ) => {
    const birthDate = new Date(year, month, day, hour, minute);
    const billionthDate = new Date(birthDate.getTime() + BILLION_MILLISECONDS);
    setBillionthSecond(billionthDate);

    const nextBillionthDate = new Date(
      billionthDate.getTime() + BILLION_MILLISECONDS
    );
    setNextBillionthSecond(nextBillionthDate);

    setProgress(calculateProgress(birthDate));
  };

  const updateTimer = () => {
    if (!billionthSecond) return;

    const now = new Date();
    const targetDate = hasPassed ? nextBillionthSecond : billionthSecond;
    if (!targetDate) return;

    const diff = targetDate.getTime() - now.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
  };

  useEffect(() => {
    if (billionthSecond) {
      const timer = setInterval(updateTimer, 1000);
      return () => clearInterval(timer);
    }
  }, [billionthSecond]);

  useEffect(() => {
    if (
      month !== undefined &&
      year !== undefined &&
      day !== undefined &&
      hour !== undefined &&
      minute !== undefined
    ) {
      calculateBillionthSecond(month, year, day, hour, minute);
    }
  }, [month, year, day, hour, minute]);

  const addToCalendar = (date: Date, billionth: number) => {
    try {
      const title = `My ${getOrdinal(billionth)} Billionth Second`;
      const description = `Celebrating my ${getOrdinal(
        billionth
      )} billionth second of life! 🎉\n\nCalculated with Billionth Second Calculator`;
      const startTime = date.toISOString().replace(/-|:|\.\d\d\d/g, "");
      const endTime = new Date(date.getTime() + 3600000)
        .toISOString()
        .replace(/-|:|\.\d\d\d/g, "");

      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        title
      )}&details=${encodeURIComponent(
        description
      )}&dates=${startTime}/${endTime}`;

      window.open(url, "_blank");
      toast.success("Opening Google Calendar...", {
        description: "Add this unique milestone to your calendar!",
      });
    } catch (error: unknown) {
      console.error("Failed to create calendar event:", error);
      toast.error("Failed to create calendar event", {
        description: "Please try again later.",
      });
    }
  };

  const generateShareImage = async () => {
    if (!milestoneRef.current) return null;

    try {
      const dataUrl = await htmlToImage.toPng(milestoneRef.current, {
        quality: 0.95,
        backgroundColor: "#000",
        style: {
          transform: "scale(2)",
          transformOrigin: "top left",
        },
      });
      return dataUrl;
    } catch (error) {
      console.error("Failed to generate image:", error);
      return null;
    }
  };

  const handleShare = async (date: Date, billionth: number) => {
    const title = `My ${getOrdinal(billionth)} Billionth Second`;
    const timePhrase = hasPassed
      ? "I'll reach my next billionth second"
      : "I'll reach my billionth second";
    const description = `🎉 ${timePhrase} on ${format(
      date,
      "PPPP"
    )} at ${format(date, "h:mm:ss a")}!\n\n${
      timeLeft ? `Only ${timeLeft} to go! ⏰` : ""
    }`;

    try {
      const imageUrl = await generateShareImage();
      const shareData: ShareData = {
        title,
        text: description,
        url: window.location.href,
      };

      if (
        imageUrl &&
        navigator.canShare &&
        navigator.canShare({
          files: [new File([imageUrl], "milestone.png", { type: "image/png" })],
        })
      ) {
        const blob = await (await fetch(imageUrl)).blob();
        const file = new File([blob], "milestone.png", { type: "image/png" });
        shareData.files = [file];
      }

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success("Thanks for sharing!", {
          description: "Your milestone has been shared successfully.",
        });
      } else {
        // Fallback to clipboard with a more engaging message
        const clipboardText = `${title}\n\n${description}\n\n🔗 Calculate your billionth second at ${window.location.href}`;
        await navigator.clipboard.writeText(clipboardText);

        if (imageUrl) {
          // If we have an image, also copy it to clipboard
          try {
            const blob = await (await fetch(imageUrl)).blob();
            await navigator.clipboard.write([
              new ClipboardItem({
                "image/png": blob,
              }),
            ]);
            toast.success("Copied to clipboard!", {
              description:
                "Image and text copied! Share them with your friends.",
            });
          } catch {
            toast.success("Copied to clipboard!", {
              description: "Text copied! Share it with your friends.",
            });
          }
        } else {
          toast.success("Copied to clipboard!", {
            description: "Share the message with your friends.",
          });
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Failed to share", {
          description: "Please try again later.",
        });
      }
    }
  };

  const handleSocialShare = async (
    platform: "X" | "facebook" | "linkedin",
    date: Date
  ) => {
    const timePhrase = hasPassed
      ? "I'll reach my next billionth second"
      : "I'll reach my billionth second";
    const description = `${timePhrase} on ${format(date, "PPPP")} at ${format(
      date,
      "h:mm:ss a"
    )}! Find your billionth second at `;
    const url = window.location.href;

    // Define share URLs
    const shareUrls = {
      X: `https://x.com/intent/tweet?text=${encodeURIComponent(
        description
      )}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}&quote=${encodeURIComponent(description)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
    };

    try {
      // Generate image for sharing
      const imageUrl = await generateShareImage();
      if (!imageUrl) {
        throw new Error("Failed to generate image");
      }

      const blob = await (await fetch(imageUrl)).blob();

      // Copy image to clipboard for easy sharing
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]);
        toast.success("Opening share window...", {
          description: `Image copied to clipboard! Share your milestone on ${
            platform.charAt(0).toUpperCase() + platform.slice(1)
          }!`,
        });
      } catch {
        toast.success("Opening share window...", {
          description: `Share your milestone on ${
            platform.charAt(0).toUpperCase() + platform.slice(1)
          }!`,
        });
      }

      // Open share window
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    } catch (error) {
      console.error("Failed to prepare share:", error);
      // Fallback to regular sharing without image
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
      toast.success("Opening share window...", {
        description: `Share your milestone on ${
          platform.charAt(0).toUpperCase() + platform.slice(1)
        }!`,
      });
    }
  };

  if (!isMounted) {
    return (
      <Card className="w-full max-w-xl border-2 bg-background/60 backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center pb-6 md:pb-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-5 w-2/3 mx-auto" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6 md:space-y-8">
          <div className="space-y-3 md:space-y-4">
            <Skeleton className="h-4 w-20" />
            <div className="flex flex-wrap md:flex-nowrap gap-2">
              <Skeleton className="h-10 w-[80px] md:w-[90px]" />
              <div className="flex items-center">
                <Skeleton className="h-4 w-2" />
              </div>
              <Skeleton className="h-10 w-[120px] md:w-[140px]" />
              <div className="flex items-center">
                <Skeleton className="h-4 w-2" />
              </div>
              <Skeleton className="h-10 w-[100px] md:w-[120px]" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-full" />
            <div className="flex items-center justify-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-6 w-48" />
            </div>
          </div>

          <div className="space-y-3">
            <Skeleton className="h-4 w-40" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-xl border-2 bg-background/60 backdrop-blur-sm">
      <CardHeader className="space-y-4 text-center pb-6 md:pb-8">
        <div className="space-y-2">
          <CardTitle className="text-xl md:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
            Calculate Your Milestone
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Enter your birth date and time to discover your billionth second
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 md:space-y-8">
        <div className="space-y-3 md:space-y-4">
          <div className="flex flex-wrap md:flex-nowrap gap-2">
            <Select
              value={day?.toString()}
              onValueChange={(value) => setDay(parseInt(value))}
            >
              <SelectTrigger className="w-[80px] md:w-[90px]">
                <SelectValue placeholder="DD" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                align="start"
                className="max-h-[300px]"
              >
                {getDays().map((d) => (
                  <SelectItem key={d} value={d.toString()}>
                    {d.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center text-muted-foreground">-</div>

            <Select
              value={month?.toString()}
              onValueChange={(value) => setMonth(parseInt(value))}
            >
              <SelectTrigger className="w-[120px] md:w-[140px]">
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                align="start"
                className="max-h-[300px]"
              >
                {months.map((month, index) => (
                  <SelectItem key={month} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center text-muted-foreground">-</div>

            <Select
              value={year?.toString()}
              onValueChange={(value) => setYear(parseInt(value))}
            >
              <SelectTrigger className="w-[100px] md:w-[120px]">
                <SelectValue placeholder="YYYY" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                align="start"
                className="max-h-[300px]"
              >
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center text-muted-foreground">at</div>

            <Select
              value={hour?.toString()}
              onValueChange={(value) => setHour(parseInt(value))}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="HH" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                align="start"
                className="max-h-[300px]"
              >
                {hours.map((h) => (
                  <SelectItem key={h} value={h.toString()}>
                    {h.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center text-muted-foreground">:</div>

            <Select
              value={minute?.toString()}
              onValueChange={(value) => setMinute(parseInt(value))}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                align="start"
                className="max-h-[300px]"
              >
                {minutes.map((m) => (
                  <SelectItem key={m} value={m.toString()}>
                    {m.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {billionthSecond && (
          <div className="space-y-6 rounded-xl bg-muted/50 p-4 md:p-6 backdrop-blur-sm">
            <div className="space-y-2">
              {hasPassed && previousMilestones.length > 0 && (
                <div className="mb-4 md:mb-6 pb-4 md:pb-6 border-b space-y-4 md:space-y-6">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Previous Milestones
                  </h3>
                  <div className="space-y-4">
                    {previousMilestones.map((milestone, index) => (
                      <div key={index} className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          {getOrdinal(index + 1)} Billionth Second
                        </h4>
                        <p className="text-sm md:text-base font-medium">
                          {format(milestone, "PPPP")}
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          at {format(milestone, "h:mm:ss a")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                ref={milestoneRef}
                className="space-y-4 p-4 rounded-lg bg-background/80"
              >
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {hasPassed ? "Next Milestone" : "Upcoming Milestone"}
                  </h3>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3 md:mb-4">
                    {getOrdinal(currentBillion)} Billionth Second
                  </h4>
                  <p className="text-xl md:text-2xl font-bold tracking-tight">
                    {format(
                      hasPassed ? nextBillionthSecond! : billionthSecond,
                      "PPPP"
                    )}
                  </p>
                  <p className="text-base md:text-lg font-medium text-muted-foreground">
                    at{" "}
                    {format(
                      hasPassed ? nextBillionthSecond! : billionthSecond,
                      "h:mm:ss a"
                    )}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      <span>
                        Progress to {getOrdinal(currentBillion)} billionth
                        second
                      </span>
                    </div>
                    <span className="font-mono tabular-nums">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <Progress
                    value={progress}
                    className="h-1.5 md:h-2 bg-muted"
                  />
                </div>

                <div className="space-y-1 md:space-y-1.5">
                  <div className="text-xs md:text-sm font-medium text-muted-foreground">
                    Time until {getOrdinal(currentBillion)} billionth second
                  </div>
                  <div className="font-mono text-lg md:text-xl font-bold tracking-tight tabular-nums">
                    {timeLeft}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-background/80 hover:bg-background"
                onClick={() =>
                  addToCalendar(
                    hasPassed ? nextBillionthSecond! : billionthSecond,
                    currentBillion
                  )
                }
              >
                <Calendar className="mr-2 h-4 w-4" />
                Add to Calendar
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 bg-background/80 hover:bg-background"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() =>
                      handleShare(
                        hasPassed ? nextBillionthSecond! : billionthSecond,
                        currentBillion
                      )
                    }
                    className="cursor-pointer"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Image
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handleSocialShare(
                        "X",
                        hasPassed ? nextBillionthSecond! : billionthSecond
                      )
                    }
                    className="cursor-pointer"
                  >
                    <TwitterIcon />
                    Share on X
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handleSocialShare(
                        "facebook",
                        hasPassed ? nextBillionthSecond! : billionthSecond
                      )
                    }
                    className="cursor-pointer"
                  >
                    <FacebookIcon />
                    Share on Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handleSocialShare(
                        "linkedin",
                        hasPassed ? nextBillionthSecond! : billionthSecond
                      )
                    }
                    className="cursor-pointer"
                  >
                    <LinkedInIcon />
                    Share on LinkedIn
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}

        <p className="text-xs md:text-sm text-muted-foreground text-center">
          One billionth second is approximately 31.7 years — a unique milestone
          in your life journey.
          {hasPassed &&
            ` You've achieved ${previousMilestones.length} billionth ${
              previousMilestones.length === 1 ? "second" : "seconds"
            } so far!`}
        </p>
      </CardContent>
    </Card>
  );
}
