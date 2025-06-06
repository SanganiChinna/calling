
"use client";

import { ChinnuButton } from "@/components/ChinnuButton";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { database } from "@/lib/firebase"; // Import Firebase database
import { ref, set, onValue, off, update } from "firebase/database"; // Import RTDB functions

// import { useToast } from "@/hooks/use-toast"; // Uncomment if you want to use toast notifications

const CALL_SIGNAL_PATH = 'chinnuCall/signal';

export default function ControllerPage() {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [isRinging, setIsRinging] = useState(false); // Indicates this controller is making a call / ringback tone
  // const { toast } = useToast(); // Uncomment for toast notifications

  useEffect(() => {
    if (typeof window !== "undefined") {
      let id = localStorage.getItem("chinnuCallerDeviceId");
      if (!id) {
        id = self.crypto?.randomUUID ? self.crypto.randomUUID() : `device-${Math.random().toString(36).slice(2, 11)}`;
        localStorage.setItem("chinnuCallerDeviceId", id);
      }
      setDeviceId(id);

      if (audioRef.current) {
        audioRef.current.load();
      }
    }
  }, []);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    if (!deviceId || !database) return;

    const signalRef = ref(database, CALL_SIGNAL_PATH);
    const listener = onValue(signalRef, (snapshot) => {
      const data = snapshot.val();
      // If the call was initiated by this device and is now inactive
      if (data && !data.active && data.fromDeviceId === deviceId) {
        setIsRinging(false);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }
    });

    return () => {
      off(signalRef, 'value', listener);
    };
  }, [deviceId]);


  const handleChinnuClick = () => {
    if (!deviceId || !database) {
      console.error("Device ID or Firebase not initialized.");
      // toast({ title: "Error", description: "Device ID or Firebase not ready.", variant: "destructive" });
      return;
    }
    console.log(`Chinnu button clicked on device: ${deviceId}. Initiating ring via Firebase...`);

    const callData = {
      fromDeviceId: deviceId,
      timestamp: Date.now(),
      active: true,
      dismissedBy: null,
      dismissTimestamp: null,
    };

    const signalRef = ref(database, CALL_SIGNAL_PATH);
    set(signalRef, callData)
      .then(() => {
        console.log("Call signal sent successfully.");
      })
      .catch(error => {
        console.error("Error sending call signal to Firebase:", error);
        // toast({ title: "Firebase Error", description: "Could not send call signal.", variant: "destructive" });
      });
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-background text-foreground font-body"
      style={{
        backgroundColor: "#FFB6C1", // Light pink
        backgroundImage: "url('/placeholder-background-image.jpg')", // Placeholder image
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}>
      <main className="flex flex-grow flex-col items-center justify-center p-4 text-center">
        <ChinnuButton onClick={handleChinnuClick} aria-label="Press to send a Chinnu call" />
        <p className="mt-8 sm:mt-10 font-headline text-xl sm:text-2xl md:text-3xl text-primary text-center">
          Tap "Chinnu" to make a call!
        </p>


        {isRinging && (
          <p className="mt-4 text-base sm:text-lg text-primary font-semibold animate-pulse">
            Ringing...
          </p>
        )}
      </main>

      <audio ref={audioRef} src="/ringtone.mp3" preload="metadata" loop={false} />

      <footer className="py-4 sm:py-6 text-center text-muted-foreground text-xs mt-auto">
        Created For you &copy; {currentYear ?? ""} &bull; Designed with <span className="text-primary">&hearts;</span>
      </footer>
    </div>
  );
}
