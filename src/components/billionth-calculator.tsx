"use client";

import { useState, useEffect } from "react";
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
import { Clock } from "lucide-react";

// Helper function to get ordinal suffix
const getOrdinal = (n: number): string => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export function BillionthCalculator() {
  const [month, setMonth] = useState<number>();
  const [year, setYear] = useState<number>();
  const [day, setDay] = useState<number>();
  const [billionthSecond, setBillionthSecond] = useState<Date>();
  const [nextBillionthSecond, setNextBillionthSecond] = useState<Date>();
  const [timeLeft, setTimeLeft] = useState<string>();
  const [progress, setProgress] = useState<number>(0);
  const [hasPassed, setHasPassed] = useState(false);
  const [currentBillion, setCurrentBillion] = useState<number>(1);
  const [previousMilestones, setPreviousMilestones] = useState<Date[]>([]);

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
    const billionSeconds = 1000000000 * 1000; // in milliseconds

    // Calculate which billionth second we're working towards
    const billionsPassed = Math.floor(elapsed / billionSeconds);
    const currentBillionStart = new Date(
      birthDate.getTime() + billionsPassed * billionSeconds
    );
    const nextBillionDate = new Date(
      currentBillionStart.getTime() + billionSeconds
    );

    // Calculate all previous milestones
    if (billionsPassed > 0) {
      const milestones = Array.from({ length: billionsPassed }, (_, i) => {
        return new Date(birthDate.getTime() + (i + 1) * billionSeconds);
      });
      setPreviousMilestones(milestones);
    } else {
      setPreviousMilestones([]);
    }

    // Calculate progress to next billion
    const currentProgress =
      ((now.getTime() - currentBillionStart.getTime()) / billionSeconds) * 100;

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
    day: number
  ) => {
    const birthDate = new Date(year, month, day);
    const billionSeconds = 1000000000;
    const billionthDate = new Date(birthDate.getTime() + billionSeconds * 1000);
    setBillionthSecond(billionthDate);

    // Calculate next billionth second (will be updated in calculateProgress if needed)
    const nextBillionthDate = new Date(
      billionthDate.getTime() + billionSeconds * 1000
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
    if (month !== undefined && year !== undefined && day !== undefined) {
      calculateBillionthSecond(month, year, day);
    }
  }, [month, year, day]);

  return (
    <Card className="w-full max-w-xl border-2">
      <CardHeader className="space-y-4 text-center pb-8">
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Calculate Your Milestone
          </CardTitle>
          <CardDescription className="text-base">
            Enter your birth date to discover your billionth second
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <label className="text-sm font-medium leading-none">Birth Date</label>
          <div className="flex gap-2">
            <Select
              value={day?.toString()}
              onValueChange={(value) => setDay(parseInt(value))}
            >
              <SelectTrigger className="w-[90px]">
                <SelectValue placeholder="DD" />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
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
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
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
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="YYYY" />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {billionthSecond && (
          <div className="space-y-6 rounded-xl bg-muted/50 p-6 backdrop-blur-sm">
            <div className="space-y-2">
              {hasPassed && previousMilestones.length > 0 && (
                <div className="mb-6 pb-6 border-b space-y-6">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Previous Milestones
                  </h3>
                  {previousMilestones.map((milestone, index) => (
                    <div key={index} className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        {getOrdinal(index + 1)} Billionth Second
                      </h4>
                      <p className="text-base font-medium">
                        {format(milestone, "PPPP")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        at {format(milestone, "h:mm:ss a")}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {hasPassed ? "Next Milestone" : "Upcoming Milestone"}
                </h3>
                <h4 className="text-sm font-medium text-muted-foreground mb-4">
                  {getOrdinal(currentBillion)} Billionth Second
                </h4>
                <p className="text-2xl font-bold tracking-tight">
                  {format(
                    hasPassed ? nextBillionthSecond! : billionthSecond,
                    "PPPP"
                  )}
                </p>
                <p className="text-lg font-medium text-muted-foreground">
                  at{" "}
                  {format(
                    hasPassed ? nextBillionthSecond! : billionthSecond,
                    "h:mm:ss a"
                  )}
                </p>
              </div>

              <div className="space-y-4 mt-6 pt-6 border-t">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        Progress to {getOrdinal(currentBillion)} billionth
                        second
                      </span>
                    </div>
                    <span className="font-mono tabular-nums">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="space-y-1.5">
                  <div className="text-sm font-medium text-muted-foreground">
                    Time until {getOrdinal(currentBillion)} billionth second
                  </div>
                  <div className="font-mono text-xl font-bold tracking-tight tabular-nums">
                    {timeLeft}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <p className="text-sm text-muted-foreground text-center">
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
