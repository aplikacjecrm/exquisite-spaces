"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2, Download, ExternalLink } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { useLanguage } from "../context/LanguageContext";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export default function PdfModal({ path, onClose }: { path: string; onClose: () => void }) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageWidth, setPageWidth] = useState(680);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1 / 1.414);
  const [fading, setFading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const pendingPage = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const { lang } = useLanguage();
  const UI = {
    pl: { fullscreen: "Pełny ekran (F)", exitFs: "Wyjdź z pełnego ekranu (F)", swipe: "/ przesunąć", fKey: "/ F = pełny ekran" },
    de: { fullscreen: "Vollbild (F)", exitFs: "Vollbild beenden (F)", swipe: "/ wischen", fKey: "/ F = Vollbild" },
    en: { fullscreen: "Fullscreen (F)", exitFs: "Exit fullscreen (F)", swipe: "/ swipe", fKey: "/ F = fullscreen" },
    fr: { fullscreen: "Plein écran (F)", exitFs: "Quitter plein écran (F)", swipe: "/ glisser", fKey: "/ F = plein écran" },
    nl: { fullscreen: "Volledig scherm (F)", exitFs: "Volledig scherm sluiten (F)", swipe: "/ vegen", fKey: "/ F = volledig scherm" },
  }[lang] ?? { fullscreen: "Fullscreen (F)", exitFs: "Exit fullscreen (F)", swipe: "/ swipe", fKey: "/ F = fullscreen" };

  /* ── Fade-transition navigation ── */
  const goToPage = useCallback((p: number) => {
    if (p === pageNumber || p < 1) return;
    pendingPage.current = p;
    setFading(true);
  }, [pageNumber]);

  useEffect(() => {
    if (!fading || pendingPage.current === null) return;
    const t = setTimeout(() => {
      setPageNumber(pendingPage.current!);
      pendingPage.current = null;
    }, 160);
    return () => clearTimeout(t);
  }, [fading]);

  const prev = useCallback(() => goToPage(pageNumber - 1), [goToPage, pageNumber]);
  const next = useCallback(() => goToPage(pageNumber + 1), [goToPage, pageNumber]);

  /* ── Responsive page width ── */
  const calcPageWidth = useCallback((ratio?: number) => {
    if (!containerRef.current) return;
    const r = ratio ?? aspectRatio;
    const h = containerRef.current.clientHeight - 24;
    const isMobile = window.innerWidth < 640;
    const w = containerRef.current.clientWidth - (isMobile ? 32 : 80);
    setPageWidth(Math.min(w, Math.round(h * r)));
  }, [aspectRatio]);

  const onResize = useCallback(() => calcPageWidth(), [calcPageWidth]);

  useEffect(() => {
    calcPageWidth();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [calcPageWidth, onResize]);

  /* ── Fullscreen ── */
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!(document.fullscreenElement || (document as any).webkitFullscreenElement));
      setTimeout(() => calcPageWidth(), 50);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
    };
  }, [calcPageWidth]);

  const toggleFullscreen = useCallback(() => {
    const isFs = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
    if (!isFs) {
      if (modalRef.current?.requestFullscreen) {
        modalRef.current.requestFullscreen().catch(() => {});
      } else if ((modalRef.current as any)?.webkitRequestFullscreen) {
        (modalRef.current as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen();
    }
  }, []);

  /* ── Keyboard ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.fullscreenElement) onClose();
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   prev();
      if (e.key === "f" || e.key === "F") toggleFullscreen();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, next, prev, toggleFullscreen]);

  /* ── Touch swipe ── */
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
    touchStartX.current = null;
  };

  const placeholderH = pageWidth > 0 ? Math.round(pageWidth / aspectRatio) : 400;

  return (
    <div ref={modalRef} className="fixed inset-0 z-[400] bg-zinc-950 flex flex-col select-none">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 flex-shrink-0 bg-zinc-950/90 backdrop-blur-sm">
        <div>
          <div className="text-zinc-600 font-mono text-[9px] tracking-[0.45em] uppercase">Exquisite Spaces · Document</div>
          <div className="text-white font-black text-base tracking-tight">Portfolio</div>
        </div>
        <div className="flex items-center gap-2">
          {!loadError && (
            <span className="font-mono text-sm mr-1">
              <span className="text-white font-bold">{pageNumber}</span>
              <span className="text-zinc-600"> / {numPages}</span>
            </span>
          )}
          <a
            href={path}
            target="_blank"
            rel="noopener noreferrer"
            title="Otwórz / pobierz PDF"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <ExternalLink size={15} />
          </a>
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? UI.exitFs : UI.fullscreen}
            className="hidden sm:flex w-9 h-9 items-center justify-center rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ── PDF area ── */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Prev */}
        <button
          onClick={prev}
          disabled={pageNumber <= 1}
          className="absolute left-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-zinc-800/80 hover:bg-white/10 disabled:opacity-0 disabled:pointer-events-none text-white transition-all hover:scale-110 border border-white/5"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Page — fade wrapper */}
        <div
          className="shadow-[0_8px_80px_rgba(0,0,0,0.9)] rounded-lg overflow-hidden"
          style={{ opacity: fading ? 0 : 1, transition: "opacity 150ms ease" }}
        >
          {loadError ? (
            <div className="flex flex-col items-center justify-center gap-6 px-8 text-center" style={{ width: Math.min(pageWidth || 400, 400), minHeight: 300 }}>
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center">
                <Download size={28} className="text-zinc-400" />
              </div>
              <div>
                <div className="text-white font-bold text-lg mb-2">PDF nie załadował się</div>
                <div className="text-zinc-500 text-sm leading-relaxed mb-6">
                  Twoja przeglądarka nie obsługuje podglądu PDF.<br />Otwórz lub pobierz plik bezpośrednio.
                </div>
                <a
                  href={path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-zinc-900 font-bold px-6 py-3 rounded-xl hover:bg-zinc-100 transition-colors text-sm"
                >
                  <ExternalLink size={15} />
                  Otwórz PDF w nowej karcie
                </a>
              </div>
            </div>
          ) : (
          <Document
            file={path}
            onLoadSuccess={({ numPages: n }) => { setNumPages(n); setLoadError(false); }}
            onLoadError={() => setLoadError(true)}
            loading={
              <div
                style={{ width: pageWidth, height: placeholderH }}
                className="bg-zinc-900 animate-pulse"
              />
            }
          >
            <Page
              key={`page_${pageNumber}`}
              pageNumber={pageNumber}
              width={pageWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={
                <div style={{ width: pageWidth, height: placeholderH }} className="bg-zinc-900" />
              }
              onLoadSuccess={(page) => {
                const r = page.originalWidth / page.originalHeight;
                setAspectRatio(r);
                calcPageWidth(r);
              }}
              onRenderSuccess={() => setFading(false)}
            />
          </Document>
          )}
        </div>

        {/* Next */}
        <button
          onClick={next}
          disabled={pageNumber >= numPages}
          className="absolute right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-zinc-800/80 hover:bg-white/10 disabled:opacity-0 disabled:pointer-events-none text-white transition-all hover:scale-110 border border-white/5"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* ── Bottom bar ── */}
      <div className="flex items-center justify-center gap-2.5 py-3 flex-shrink-0 min-h-[40px]">
        {numPages > 1 && numPages <= 28 && Array.from({ length: numPages }, (_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={`rounded-full transition-all duration-300 ${
              i + 1 === pageNumber ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-zinc-700 hover:bg-zinc-400"
            }`}
          />
        ))}
        {numPages > 28 && (
          <span className="text-zinc-500 font-mono text-xs tracking-widest">{pageNumber} / {numPages}</span>
        )}
        <span className="text-zinc-700 font-mono text-[9px] tracking-[0.4em] ml-2 uppercase hidden sm:inline">
          ← → {typeof window !== "undefined" && "ontouchstart" in window ? UI.swipe : UI.fKey}
        </span>
      </div>
    </div>
  );
}
