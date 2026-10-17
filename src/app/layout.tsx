import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "POWER PADEL CLUB • Pistas Panorámicas & Pro-Shop Oficial",
  description:
    "Complejo exclusivo de pádel en Mendoza con 3 pistas panorámicas homologadas de césped azul. Reserva online al instante y programa Test & Rent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${syne.variable} ${jakarta.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col selection:bg-sky-500 selection:text-neutral-950">
        {children}
      </body>
    </html>
  );
}
