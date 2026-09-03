"use client";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

export function PwaRegister() {
  const [installEvt, setInstallEvt] = useState<any>(null);
  const [notifGranted, setNotifGranted] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const onBefore = (e: any) => {
      e.preventDefault();
      setInstallEvt(e);
    };
    window.addEventListener("beforeinstallprompt", onBefore);
    if ("Notification" in window && Notification.permission === "granted") {
      setNotifGranted(true);
    }
    return () => window.removeEventListener("beforeinstallprompt", onBefore);
  }, []);

  async function requestNotifs() {
    if (!("Notification" in window)) return;
    // Best practice: request via browser UI. Here we subscribe through SW.
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      setNotifGranted(true);
      try {
        const reg = await navigator.serviceWorker.ready;
        await reg.showNotification("Wellbeing Compass", {
          body: "Notifications enabled ✅ New articles will reach you here.",
          icon: "/icons/icon-192.png",
        });
      } catch {}
    }
  }

  function install() {
    if (!installEvt) return;
    installEvt.prompt();
    installEvt.userChoice.then(() => setInstallEvt(null));
  }

  if (!installEvt && notifGranted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {installEvt && (
        <button onClick={install} className="px-4 py-2.5 rounded-full bg-[#0D2A4A] text-white text-sm font-bold shadow-lg hover:bg-black transition">
          📲 Install app
        </button>
      )}
      {!notifGranted && (
        <button onClick={requestNotifs} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-accent-400 text-[#0D2A4A] text-sm font-bold shadow-lg hover:bg-accent-500 transition">
          <Bell className="h-4 w-4" /> Enable notifications
        </button>
      )}
    </div>
  );
}
