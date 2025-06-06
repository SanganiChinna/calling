
"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, PhoneIncoming, PhoneOff } from "lucide-react";
import Link from "next/link";
import { database } from "@/lib/firebase"; // Import Firebase database
import { ref, onValue, off, update } from "firebase/database"; // Import RTDB functions

const CALL_SIGNAL_PATH = 'chinnuCall/signal';

export default function TargetPage() {
  const [targetDeviceId, setTargetDeviceId] = useState<string | null>(null);
  const [isRinging, setIsRinging] = useState(false);
  const [callerDeviceId, setCallerDeviceId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let id = localStorage.getItem("chinnuTargetDeviceId");
      if (!id) {
        id = `target-${self.crypto?.randomUUID ? self.crypto.randomUUID() : Math.random().toString(36).slice(2, 11)}`;
        localStorage.setItem("chinnuTargetDeviceId", id);
      }
      setTargetDeviceId(id);

      if (audioRef.current) {
        audioRef.current.load();
      }
    }
  }, []);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    if (!targetDeviceId || !database) return; // Wait for targetDeviceId and Firebase to be ready

    const signalRef = ref(database, CALL_SIGNAL_PATH);
    const listener = onValue(signalRef, (snapshot) => {
      const signalData = snapshot.val();
      if (signalData && signalData.active) {
        setCallerDeviceId(signalData.fromDeviceId);
        setIsRinging(true);
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(console.error);
        }
      } else { // Signal is not active or doesn't exist
        setIsRinging(false);
        setCallerDeviceId(null);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }
    });

    return () => {
      off(signalRef, 'value', listener); // Detach the listener
    };
  }, [targetDeviceId]);

  const handleDismissClick = () => {
    if (!targetDeviceId || !database) {
      console.error("Target Device ID or Firebase not initialized for dismiss.");
      return;
    }
    setIsRinging(false);
    setCallerDeviceId(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const signalRef = ref(database, CALL_SIGNAL_PATH);
    // Update the existing signal to show it's dismissed by this target
    // We use update() to only modify specific fields and not overwrite fromDeviceId if another call is incoming.
    // However, for this simple model, the controller usually sets the fromDeviceId.
    update(signalRef, {
      active: false,
      dismissedBy: targetDeviceId,
      dismissTimestamp: Date.now()
    }).catch(error => {
      console.error("Error updating signal in Firebase on dismiss:", error);
    });
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
                  This page listens for incoming Chinnu calls via Firebase.
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

      <audio ref={audioRef} src="/ringtone.mp3" preload="metadata" loop={true} />

      <footer className="py-4 sm:py-6 text-center text-muted-foreground text-xs">
        Chinnu Target &copy; {currentYear ?? ""}
      </footer>
    </div>
  );
}
