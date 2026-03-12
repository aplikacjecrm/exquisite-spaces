import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Exquisite Spaces – Budujemy infrastrukturę z pasją i precyzją",
  description:
    "Wyspecjalizowana firma budowlano-instalacyjna z Żywca. Sieci gazowe, wod-kan, telekomunikacyjne, elektryczne. Własny sprzęt i doświadczona kadra.",
  icons: {
    icon: "/images/Logo.png",
    apple: "/images/Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
