"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const { lang } = useLanguage();
  const label: Record<string, string> = { pl: "Przewiń na górę", de: "Nach oben", en: "Scroll to top", fr: "Remonter", nl: "Omhoog" };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
        clearTimeout(timer);
        timer = setTimeout(() => setVisible(false), 2000);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); clearTimeout(timer); };
  }, []);

  function handleClick() {
    if (spinning) return;
    setSpinning(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setSpinning(false), 700);
  }

  return (
    <button
      onClick={handleClick}
      aria-label={label[lang] ?? "Scroll to top"}
      className={`fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[950] transition-all duration-300 hover:scale-110 drop-shadow-xl ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <img
        src="/images/Logo.png"
        alt="ES"
        className={`w-16 h-16 object-contain transition-transform ${spinning ? "animate-spin-once" : ""}`}
      />
    </button>
  );
}
