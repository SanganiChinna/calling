
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-headline text-primary mb-4">
          Welcome to Chinnu Caller
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose your role to get started.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Button
          asChild
          variant="outline"
          className="w-full h-24 text-xl py-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-2 border-primary group"
          aria-label="Go to Controller Page"
        >
          <Link href="/controller">
            <div className="flex items-center justify-between w-full">
              <span>Controller Page</span>
              <ArrowRight className="h-6 w-6 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="w-full h-24 text-xl py-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-2 border-primary group"
          aria-label="Go to Target Device Page"
        >
          <Link href="/target">
            <div className="flex items-center justify-between w-full">
              <span>Target Device Page</span>
              <ArrowRight className="h-6 w-6 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </Button>
      </div>
      <footer className="fixed bottom-6 text-center text-muted-foreground text-xs w-full">
        Chinnu Caller &copy; {currentYear ?? ""}
      </footer>
    </div>
  );
}
