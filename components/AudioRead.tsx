"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Volume2, VolumeX, Pause, Play, Gauge, Radio } from "lucide-react";

export function AudioRead({ articleText, title }: { articleText: string; title: string }) {
  const [supported, setSupported] = useState(true);
  const [reading, setReading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [rate, setRate] = useState<number>(1.0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      try {
        window.speechSynthesis?.cancel();
      } catch {}
    };
  }, []);

  const speak = useCallback(
    (speed = rate) => {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();

      const clean = `${title}. ${articleText.replace(/[#*`>]/g, " ").slice(0, 8000)}`;
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = "en-GB";
      u.rate = speed;

      u.onend = () => {
        setReading(false);
        setPaused(false);
      };
      u.onerror = () => {
        setReading(false);
        setPaused(false);
      };

      utteranceRef.current = u;
      window.speechSynthesis.speak(u);
      setReading(true);
      setPaused(false);
    },
    [articleText, title, rate]
  );

  const pausePlayback = useCallback(() => {
    if ("speechSynthesis" in window && reading) {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }, [reading]);

  const resumePlayback = useCallback(() => {
    if ("speechSynthesis" in window && paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      speak(rate);
    }
  }, [paused, speak, rate]);

  const stopPlayback = useCallback(() => {
    try {
      window.speechSynthesis?.cancel();
    } catch {}
    setReading(false);
    setPaused(false);
  }, []);

  const changeRate = (newRate: number) => {
    setRate(newRate);
    if (reading && !paused) {
      speak(newRate);
    }
  };

  if (!supported) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted">
        <Volume2 className="h-3.5 w-3.5" /> Audio playback not supported in this browser
      </span>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={reading ? (paused ? resumePlayback : pausePlayback) : () => speak(rate)}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition shadow-sm ${
            reading
              ? "bg-brand-700 text-white hover:bg-brand-800 dark:bg-accent-400 dark:text-ink"
              : "bg-surface dark:bg-[#061A33] border border-border dark:border-white/10 text-ink dark:text-slate-100 hover:bg-brand-50"
          }`}
        >
          {reading ? (
            paused ? (
              <>
                <Play className="h-4 w-4" /> Resume narration
              </>
            ) : (
              <>
                <Pause className="h-4 w-4" /> Pause narration
              </>
            )
          ) : (
            <>
              <Volume2 className="h-4 w-4 text-brand-600 dark:text-accent-400" /> Listen to article
            </>
          )}
        </button>

        {reading && (
          <>
            <button
              type="button"
              onClick={stopPlayback}
              title="Stop playback"
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 transition"
            >
              <VolumeX className="h-3.5 w-3.5" /> Stop
            </button>

            <div className="inline-flex items-center gap-1 bg-surface dark:bg-[#061A33] border border-border dark:border-white/10 rounded-full px-2 py-1 text-xs font-bold text-muted dark:text-slate-300">
              <Gauge className="h-3 w-3" />
              {[1.0, 1.25, 1.5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => changeRate(s)}
                  className={`px-1.5 py-0.5 rounded-full transition ${
                    rate === s ? "bg-brand-500 text-white dark:bg-accent-400 dark:text-ink" : "hover:text-ink"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Floating Sticky Mini-Player when actively listening while scrolling */}
      {reading && (
        <div className="fixed bottom-4 right-4 z-40 max-w-sm w-[calc(100%-2rem)] bg-white/95 dark:bg-[#0A223C]/95 backdrop-blur-md border border-brand-200 dark:border-white/10 shadow-2xl rounded-2xl p-3 animate-in flex items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="h-7 w-7 rounded-full bg-brand-500 text-white grid place-items-center shrink-0">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-brand-600 dark:text-accent-400">
                {paused ? "Audio Paused" : "Listening Now"}
              </p>
              <p className="text-xs font-bold text-brand-700 dark:text-white truncate">{title}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={paused ? resumePlayback : pausePlayback}
              className="h-7 w-7 grid place-items-center rounded-full bg-brand-50 dark:bg-white/10 text-brand-700 dark:text-white hover:bg-brand-100"
              title={paused ? "Resume" : "Pause"}
            >
              {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            </button>
            <button
              type="button"
              onClick={stopPlayback}
              className="h-7 w-7 grid place-items-center rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
              title="Close Player"
            >
              <VolumeX className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
