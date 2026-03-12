"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";

const SUPABASE = "https://yinnyzflmywiplluyyhl.supabase.co/storage/v1/object/public/Film";

const videos = [
  `${SUPABASE}/video%20hero%201.mp4`,
  `${SUPABASE}/video%20hero%202.mp4`,
  `${SUPABASE}/video%20hero%203.mp4`,
];

export default function Hero() {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null, null]);

  useEffect(() => {
    const vid = videoRefs.current[active];
    if (!vid) return;
    vid.currentTime = 0;
    vid.play().catch(() => {});
  }, [active]);

  const handleEnded = () => {
    setFading(true);
    setTimeout(() => {
      setActive((i) => (i + 1) % videos.length);
      setFading(false);
    }, 800);
  };

  return (
    <section className="hero-section relative overflow-hidden">

      {/* Video layers — crossfade */}
      {videos.map((src, i) => (
        <video
          key={src}
          ref={(el) => { videoRefs.current[i] = el; }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[800ms] ${
            i === active ? (fading ? "opacity-0" : "opacity-100") : "opacity-0"
          }`}
          src={src}
          poster="/images/a1.png"
          muted
          playsInline
          preload={i === active ? "auto" : i === (active + 1) % videos.length ? "metadata" : "none"}
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
            onClick={() => { setFading(true); setTimeout(() => { setActive(i); setFading(false); }, 800); }}
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
