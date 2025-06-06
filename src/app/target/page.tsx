
"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, PhoneIncoming, PhoneOff } from "lucide-react";

const CALL_SIGNAL_KEY = 'chinnuCallSignal';

export default function TargetPage() {
  const [targetDeviceId, setTargetDeviceId] = useState<string | null>(null);
  const [isRinging, setIsRinging] = useState(false);
  const [callerDeviceId, setCallerDeviceId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Initialize target device ID
    if (typeof window !== "undefined") {
      let id = localStorage.getItem("chinnuTargetDeviceId");
      if (!id) {
        id = `target-${self.crypto?.randomUUID ? self.crypto.randomUUID() : Math.random().toString(36).slice(2, 11)}`;
        localStorage.setItem("chinnuTargetDeviceId", id);
      }
      setTargetDeviceId(id);

      // Preload audio
      if (audioRef.current) {
        audioRef.current.load();
      }
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === CALL_SIGNAL_KEY && event.newValue) {
        try {
          const signalData = JSON.parse(event.newValue);
          if (signalData.active) {
            setCallerDeviceId(signalData.fromDeviceId);
            setIsRinging(true);
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(console.error);
            }
          } else {
            // Signal is not active (e.g., dismissed by another target or caller cancelled)
            setIsRinging(false);
            setCallerDeviceId(null);
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
          }
        } catch (error) {
          console.error("Error parsing call signal data:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Check initial state on load
    const currentSignal = localStorage.getItem(CALL_SIGNAL_KEY);
    if (currentSignal) {
        try {
            const signalData = JSON.parse(currentSignal);
            if (signalData.active) {
                setCallerDeviceId(signalData.fromDeviceId);
                setIsRinging(true);
                 if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play().catch(console.error);
                }
            }
        } catch (error) {
            console.error("Error parsing initial call signal data:", error);
        }
    }


    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleDismissClick = () => {
    setIsRinging(false);
    setCallerDeviceId(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    // Notify other instances/caller that call is dismissed by this target
    const currentSignalRaw = localStorage.getItem(CALL_SIGNAL_KEY);
    let currentSignal = {};
    if (currentSignalRaw) {
        try {
            currentSignal = JSON.parse(currentSignalRaw);
        } catch (e) { /* ignore parse error */ }
    }
    localStorage.setItem(CALL_SIGNAL_KEY, JSON.stringify({ 
      ...currentSignal,
      active: false, 
      dismissedBy: targetDeviceId,
      timestamp: Date.now() 
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <header className="p-4 sm:p-6">
        <Card className="w-full max-w-md mx-auto sm:mx-0 sm:ml-auto sm:mr-4 bg-card shadow-lg rounded-lg border-border">
          <CardHeader className="pb-3 pt-4 px-4 sm:px-5">
            <CardTitle className="font-headline text-lg sm:text-xl flex items-center text-card-foreground">
              <Info className="mr-2 h-5 w-5 text-primary shrink-0" />
              Target Device
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-5 pb-4">
            {targetDeviceId ? (
              <>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  ID: <span className="font-mono text-foreground break-all">{targetDeviceId}</span>
                </p>
                <CardDescription className="text-xs mt-2">
                  This page listens for incoming Chinnu calls.
                </CardDescription>
              </>
            ) : (
              <p className="text-xs sm:text-sm text-muted-foreground">Initializing device ID...</p>
            )}
          </CardContent>
        </Card>
      </header>

      <main className="flex flex-grow flex-col items-center justify-center p-4 text-center">
        <Card className="w-full max-w-md bg-card shadow-xl rounded-xl border-border">
          <CardHeader className="pt-6">
            {isRinging ? (
              <PhoneIncoming className="mx-auto h-20 w-20 text-primary animate-pulse" />
            ) : (
              <PhoneOff className="mx-auto h-20 w-20 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent className="pb-6">
            {isRinging ? (
              <>
                <CardTitle className="font-headline text-2xl sm:text-3xl text-primary">Incoming Call!</CardTitle>
                {callerDeviceId && (
                  <p className="text-sm text-muted-foreground mt-1">
                    From: <span className="font-mono text-foreground">{callerDeviceId.substring(0, 12)}...</span>
                  </p>
                )}
                <Button onClick={handleDismissClick} className="mt-6 w-full sm:w-auto" variant="destructive">
                  <PhoneOff className="mr-2 h-4 w-4" /> Dismiss Call
                </Button>
              </>
            ) : (
              <>
                <CardTitle className="font-headline text-2xl sm:text-3xl text-primary">Awaiting Call</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Keep this page open to receive Chinnu calls.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </main>
      
      <audio ref={audioRef} src="/assets/ringtone.mp3" preload="auto" loop={true} />

      <footer className="py-4 sm:py-6 text-center text-muted-foreground text-xs">
        Chinnu Target &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
