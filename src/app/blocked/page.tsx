import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BlockedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Rate Limit Exceeded
        </h1>
        <p className="text-muted-foreground">
          You&apos;ve made too many requests. Please wait a few seconds before
          trying again.
        </p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
