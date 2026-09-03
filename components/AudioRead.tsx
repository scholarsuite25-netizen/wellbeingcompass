"use client";
import { useState, useEffect, useCallback } from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";

// Lightweight text-to-speech using the browser's Web Speech API (no external key needed)
export function AudioRead({ articleText, title }: { articleText: string; title: string }) {
  const [supported, setSupported] = useState(true);
  const [reading, setReading] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => { try { window.speechSynthesis?.cancel(); } catch {} };
  }, []);

  const speak = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const clean = `${title}. ${articleText.replace(/[#*`>]/g, " ").slice(0, 6000)}`;
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = "en-GB";
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
    setReading(true);
    u.onend = () => setReading(false);
    u.onerror = () => setReading(false);
  }, [articleText, title]);

  const stop = useCallback(() => {
    try { window.speechSynthesis?.cancel(); } catch {}
    setReading(false);
  }, []);

  if (!supported) {
    return <span className="inline-flex items-center gap-1.5 text-xs text-muted"><Volume2 className="h-3.5 w-3.5"/> Audio not supported in this browser</span>;
  }

  return (
    <button
      onClick={reading ? stop : speak}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition shadow-sm ${reading ? "bg-red-600 text-white hover:bg-red-700" : "bg-surface border border-border text-ink hover:bg-brand-50"}`}
    >
      {reading ? <VolumeX className="h-4 w-4"/> : <Volume2 className="h-4 w-4"/>}
      {reading ? "Stop reading" : "Listen to this article"}
    </button>
  );
}
