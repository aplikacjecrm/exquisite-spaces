"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X, Check } from "lucide-react";

const COOKIE_KEY = "cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const val = localStorage.getItem(COOKIE_KEY);
    if (!val) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(COOKIE_KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[900] p-3 sm:p-4 pointer-events-none">
      <div className="max-w-3xl mx-auto pointer-events-auto">
        <div className="bg-zinc-900/95 backdrop-blur-md border border-zinc-700/60 rounded-2xl shadow-[0_-8px_40px_rgba(0,0,0,0.4)] p-4 sm:p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Cookie size={15} className="text-zinc-300" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-sm mb-1">Ta strona używa plików cookie</div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Używamy niezbędnych plików cookie do działania strony oraz analitycznych do zbierania anonimowych statystyk odwiedzin. Nie korzystamy z reklam ani śledzenia przez zewnętrzne sieci.{" "}
                <Link href="/polityka-cookies" className="text-zinc-300 underline hover:text-white transition-colors">
                  Polityka cookies
                </Link>
                {" · "}
                <Link href="/polityka-prywatnosci" className="text-zinc-300 underline hover:text-white transition-colors">
                  Prywatność
                </Link>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <button
              onClick={reject}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 text-xs font-bold transition-all"
            >
              <X size={13} /> Tylko niezbędne
            </button>
            <button
              onClick={accept}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-bold transition-all"
            >
              <Check size={13} /> Akceptuję wszystkie
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
