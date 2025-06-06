
"use client";

import { ChinnuButton } from "@/components/ChinnuButton";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, ExternalLink } from "lucide-react";
// import { useToast } from "@/hooks/use-toast"; // Uncomment if you want to use toast notifications

export default function ControllerPage() {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  // const { toast } = useToast(); // Uncomment for toast notifications

  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window !== "undefined") {
      let id = localStorage.getItem("chinnuCallerDeviceId");
      if (!id) {
        id = self.crypto?.randomUUID ? self.crypto.randomUUID() : `device-${Math.random().toString(36).slice(2, 11)}`;
        localStorage.setItem("chinnuCallerDeviceId", id);
      }
      setDeviceId(id);

      // Preload audio metadata
      if (audioRef.current) {
        audioRef.current.load(); // This will respect the preload="metadata" attribute
      }
    }
  }, []);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);


  const handleChinnuClick = () => {
    console.log(`Chinnu button clicked on device: ${deviceId}. Initiating ring...`);

    if (deviceId) {
      localStorage.setItem('chinnuCallSignal', JSON.stringify({
        fromDeviceId: deviceId,
        timestamp: Date.now(),
        active: true
      }));
    }

    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Rewind to start
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
        // toast({ // Uncomment for toast notifications
        //   title: "Audio Playback Error",
        //   description: "Could not play ringtone. Please check browser permissions.",
        //   variant: "destructive",
        // });
      });
    }

    // Example of using toast notification
    // toast({ // Uncomment for toast notifications
    //   title: "Chinnu Call Sent!",
    //   description: `Device ${deviceId?.substring(0,8)}... attempted to call.`,
    // });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <header className="p-4 sm:p-6 flex justify-between items-center">
        <Link href="/" className="text-sm text-primary hover:underline">
          &larr; Back to Home
        </Link>
        <Card className="w-full max-w-md bg-card shadow-lg rounded-lg border-border">
          <CardHeader className="pb-3 pt-4 px-4 sm:px-5">
            <CardTitle className="font-headline text-lg sm:text-xl flex items-center text-card-foreground">
              <Info className="mr-2 h-5 w-5 text-primary shrink-0" />
              Your Device (Caller)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-5 pb-4">
            {deviceId ? (
              <>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  ID: <span className="font-mono text-foreground break-all">{deviceId}</span>
                </p>
                <CardDescription className="text-xs mt-2">
                  This unique ID helps identify your device for calls.
                </CardDescription>
              </>
            ) : (
              <p className="text-xs sm:text-sm text-muted-foreground">Initializing device ID...</p>
            )}
          </CardContent>
        </Card>
      </header>

      <main className="flex flex-grow flex-col items-center justify-center p-4 text-center">
        <ChinnuButton onClick={handleChinnuClick} aria-label="Press to send a Chinnu call" />
        <p className="mt-8 sm:mt-10 font-headline text-xl sm:text-2xl md:text-3xl text-primary">
          Tap "Chinnu" to make a call!
        </p>
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-xs sm:max-w-md md:max-w-lg">
          When you press the button, it will attempt to play a ringtone locally and send a signal to any open Target Device page.
        </p>
        <Link href="/target" className="mt-4 inline-flex items-center text-sm text-primary hover:underline" target="_blank" rel="noopener noreferrer">
          Open Target Device Page <ExternalLink className="ml-1 h-4 w-4" />
        </Link>
      </main>

      <audio ref={audioRef} src="/ringtone.mp3" preload="metadata" loop={false} />

      <footer className="py-4 sm:py-6 text-center text-muted-foreground text-xs">
        Chinnu Caller (Controller) &copy; {currentYear ?? ""} &bull; Designed with <span className="text-primary">&hearts;</span>
      </footer>
    </div>
  );
}
