"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, Shield } from "lucide-react";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push(params.get("from") ?? "/admin");
      } else {
        const data = await res.json();
        setError(data.error ?? "Błąd logowania.");
      }
    } catch {
      setError("Błąd połączenia.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
            <Shield size={28} className="text-zinc-400" />
          </div>
          <h1 className="text-white font-black text-xl tracking-tight">PANEL ADMINISTRACYJNY</h1>
          <p className="text-zinc-500 text-sm mt-1 font-mono">exquisitespaces.pl</p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-[0_0_60px_rgba(0,0,0,0.5)]"
        >
          <div className="mb-5">
            <label className="block text-zinc-400 text-xs font-mono tracking-widest uppercase mb-2">
              Hasło dostępu
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-9 pr-10 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 px-3 py-2.5 rounded-lg bg-red-950/50 border border-red-900/50 text-red-400 text-xs font-mono">
              ✗ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-white hover:bg-zinc-100 text-zinc-900 font-bold py-3 rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sprawdzanie..." : "Zaloguj się"}
          </button>
        </form>

        <p className="text-center text-zinc-700 text-xs font-mono mt-6">
          Dostęp tylko dla autoryzowanych administratorów
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
