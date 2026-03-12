"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";

const SUPABASE = "https://yinnyzflmywiplluyyhl.supabase.co/storage/v1/object/public/Film";

const videos = [
  `${SUPABASE}/video%20hero%202.mp4`,
  `/images/kontakt video.mp4`,
];

export default function Hero() {
  const [active, setActive] = useState(0);
  const [incoming, setIncoming] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null]);

  useEffect(() => {
    const vid = videoRefs.current[0];
    if (!vid) return;
    vid.currentTime = 0;
    vid.play().catch(() => {});
  }, []);

  const triggerTransition = (toIdx: number) => {
    if (incoming !== null) return;
    const vid = videoRefs.current[toIdx];
    if (vid) { vid.currentTime = 0; vid.play().catch(() => {}); }
    setIncoming(toIdx);
    setTimeout(() => {
      setActive(toIdx);
      setIncoming(null);
    }, 1200);
  };

  const handleEnded = () => {
    triggerTransition((active + 1) % videos.length);
  };

  const getOpacity = (i: number) => {
    if (incoming !== null) {
      if (i === incoming) return "opacity-100";
      if (i === active) return "opacity-0";
      return "opacity-0";
    }
    return i === active ? "opacity-100" : "opacity-0";
  };

  return (
    <section className="hero-section relative overflow-hidden">

      {/* Video layers — simultaneous crossfade */}
      {videos.map((src, i) => (
        <video
          key={src}
          ref={(el) => { videoRefs.current[i] = el; }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-in-out ${getOpacity(i)}`}
          src={src}
          poster="/images/a1.png"
          muted
          playsInline
          preload="auto"
          onEnded={i === active ? handleEnded : undefined}
        />
      ))}

      {/* Scanline grid */}
      <div className="hero-grid absolute inset-0 opacity-[0.11]" />

      {/* Bottom vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 via-transparent to-transparent" />

      {/* Video dots indicator */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {videos.map((_, i) => (
          <button
            key={i}
            onClick={() => triggerTransition(i)}
            className={`h-1 rounded-full transition-all duration-500 ${i === active ? "w-6 bg-white" : "w-2 bg-white/40"}`}
            aria-label={`Wideo ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <a
        href="#akcja"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 hover:text-white/80 transition-colors z-10"
        aria-label="Przewiń w dół"
      >
        <ArrowDown size={20} className="animate-bounce" />
      </a>
    </section>
  );
}
