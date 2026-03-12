"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function send(event: string, extra: Record<string, unknown> = {}) {
  const payload = {
    event,
    path: window.location.pathname,
    referrer: document.referrer,
    data: extra,
  };
  navigator.sendBeacon?.("/api/track", JSON.stringify(payload)) ||
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
}

export default function Analytics() {
  const pathname = usePathname();
  const startRef = useRef<number>(Date.now());
  const clickCountRef = useRef(0);

  useEffect(() => {
    startRef.current = Date.now();
    send("pageview");

    const handleClick = (e: MouseEvent) => {
      clickCountRef.current++;
      const target = (e.target as HTMLElement).closest("a,button,[data-track]");
      if (!target) return;
      const label =
        target.getAttribute("data-track") ||
        target.getAttribute("aria-label") ||
        (target as HTMLAnchorElement).href?.replace(window.location.origin, "") ||
        target.textContent?.trim().slice(0, 40) ||
        "unknown";
      send("click", { label, tag: target.tagName.toLowerCase() });
    };

    const handleUnload = () => {
      const duration = Math.round((Date.now() - startRef.current) / 1000);
      send("duration", { seconds: duration, clicks: clickCountRef.current });
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("beforeunload", handleUnload);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") handleUnload();
    });

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [pathname]);

  return null;
}
