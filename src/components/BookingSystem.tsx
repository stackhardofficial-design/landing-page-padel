"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Clock,
  Layers,
  Check,
  Zap,
  ArrowRight,
  Users,
  ShieldCheck,
  Box,
  RotateCcw,
  Share2,
  Plus,
  Minus,
  Sun,
  Wind,
  Sparkles,
  QrCode,
} from "lucide-react";

interface Court {
  id: number;
  name: string;
  subtitle: string;
  zone: string;
  surface: string;
  glass: string;
  lighting: string;
  orient: string;
}

const COURTS: Court[] = [
  {
    id: 1,
    name: "Cancha 1",
    subtitle: "Frontal Panorámica",
    zone: "Acceso Principal",
    surface: "Monofilamento Azul Pro",
    glass: "Templado 12mm Full View",
    lighting: "8 Focos LED 800 Lux",
    orient: "Norte-Sur • Oficial",
  },
  {
    id: 2,
    name: "Cancha 2",
    subtitle: "Central Complejo",
    zone: "Sector Lounge",
    surface: "Monofilamento Azul Pro",
    glass: "Templado 12mm Acústico",
    lighting: "8 Focos LED Asimétricos",
    orient: "Norte-Sur • Central",
  },
  {
    id: 3,
    name: "Cancha 3",
    subtitle: "Sector Parque",
    zone: "Jardín & Tercer Tiempo",
    surface: "Monofilamento Azul Pro",
    glass: "Templado 12mm Panorámico",
    lighting: "8 Focos LED Nocturnos",
    orient: "Norte-Sur • Parque",
  },
];

const TIME_SLOTS = [
  "08:30",
  "10:00",
  "11:30",
  "14:30",
  "16:00",
  "17:30",
  "19:00",
  "20:30",
  "22:00",
];

// Simulación realista de ocupación por cancha y horario
const OCCUPIED_MAP: Record<string, string[]> = {
  "1": ["16:00", "19:00"],
  "2": ["17:30", "20:30"],
  "3": ["19:00"],
};

export default function BookingSystem() {
  // Generación dinámica de los próximos 7 días
  const days = useMemo(() => {
    const result = [];
    const dayNames = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
    const monthNames = [
      "ENE",
      "FEB",
      "MAR",
      "ABR",
      "MAY",
      "JUN",
      "JUL",
      "AGO",
      "SEP",
      "OCT",
      "NOV",
      "DIC",
    ];
    const base = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const iso = d.toISOString().split("T")[0];
      result.push({
        iso,
        label: i === 0 ? "HOY" : i === 1 ? "MAÑANA" : dayNames[d.getDay()],
        dayNum: d.getDate(),
        month: monthNames[d.getMonth()],
      });
    }
    return result;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(days[0].iso);
  const [viewMode, setViewMode] = useState<"map" | "time">("map");
  const [isIsometric, setIsIsometric] = useState<boolean>(true);
  const [selectedCourt, setSelectedCourt] = useState<number>(1);
  const [duration, setDuration] = useState<60 | 90>(90);
  const [selectedSlot, setSelectedSlot] = useState<string>("20:30");

  // Adicionales interactivos
  const [racketCount, setRacketCount] = useState<number>(0);
  const [includeBalls, setIncludeBalls] = useState<boolean>(true);
  const [splitPlayers, setSplitPlayers] = useState<number>(4);

  // Datos del jugador
  const [playerName, setPlayerName] = useState<string>("");
  const [playerPhone, setPlayerPhone] = useState<string>("");
  const [bookingConfirmed, setBookingConfirmed] = useState<{
    code: string;
    court: string;
    date: string;
    slot: string;
    duration: number;
    total: number;
  } | null>(null);

  const courtPrice = duration === 60 ? 16000 : 22000;
  const racketsTotal = racketCount * 4000;
  const ballsTotal = includeBalls ? 7500 : 0;
  const grandTotal = courtPrice + racketsTotal + ballsTotal;
  const perPlayerCost = Math.round(grandTotal / splitPlayers);

  const isSlotOccupied = (courtId: number, slot: string) => {
    return OCCUPIED_MAP[String(courtId)]?.includes(slot) ?? false;
  };

  const handleSelectCourt = (courtId: number) => {
    setSelectedCourt(courtId);
    if (isSlotOccupied(courtId, selectedSlot)) {
      const firstAvailable = TIME_SLOTS.find((s) => !isSlotOccupied(courtId, s));
      if (firstAvailable) setSelectedSlot(firstAvailable);
    }
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !playerPhone.trim()) return;
    const randomCode = `PP-${Math.floor(1000 + Math.random() * 9000)}`;
    const courtObj = COURTS.find((c) => c.id === selectedCourt);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#0ea5e9", "#38bdf8", "#ffffff", "#09090b"],
      });
    } catch {
      // Ignorar si el navegador bloquea canvas-confetti
    }

    setBookingConfirmed({
      code: randomCode,
      court: courtObj ? courtObj.name : `Cancha ${selectedCourt}`,
      date: selectedDate,
      slot: selectedSlot,
      duration,
      total: grandTotal,
    });
  };

  const activeCourtObj =
    COURTS.find((c) => c.id === selectedCourt) || COURTS[0];

  return (
    <div className="space-y-8">
      {/* BARRA DE TELEMETRÍA METEOROLÓGICA Y ESTADO DE PISTAS EN VIVO */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-neutral-950 text-white border border-neutral-800 px-5 py-3.5 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            ESTADO DEL PREDIO: 100% OPERATIVO
          </span>
          <span className="hidden md:inline text-neutral-600">|</span>
          <span className="hidden md:inline text-neutral-300">
            SUPERFICIE SECA • SÍLICE CALIBRADA
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-5 text-neutral-300">
          <span className="flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-sky-400" />
            MENDOZA: 24°C • HUMEDAD 31%
          </span>
          <span className="flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-sky-400" />
            VIENTO: 6 KM/H (ÓPTIMO)
          </span>
        </div>
      </motion.div>

      {/* PASO 1: FECHA Y MODO DE VISUALIZACIÓN */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border border-neutral-200 p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)]"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-neutral-950 text-sky-400 flex items-center justify-center font-mono text-xs font-black border border-neutral-800">
              01
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-sky-600 font-bold block">
                AGENDA EN TIEMPO REAL • SIN SEÑA PREVIA
              </span>
              <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                Selecciona Fecha y Modo de Visualización
              </h3>
            </div>
          </div>

          <div className="inline-flex border border-neutral-900 bg-neutral-100 p-0.5 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setViewMode("map")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === "map"
                  ? "bg-neutral-950 text-white shadow-sm"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              Plano 3D/2D
            </button>
            <button
              type="button"
              onClick={() => setViewMode("time")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === "time"
                  ? "bg-neutral-950 text-white shadow-sm"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              Matriz Horaria
            </button>
          </div>
        </div>

        {/* Selector de 7 días */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
          {days.map((d) => {
            const isSelected = d.iso === selectedDate;
            return (
              <motion.button
                whileTap={{ scale: 0.97 }}
                key={d.iso}
                type="button"
                data-cursor="ELEGIR DÍA"
                onClick={() => setSelectedDate(d.iso)}
                className={`p-3.5 text-center transition-all border relative overflow-hidden group cursor-pointer ${
                  isSelected
                    ? "bg-neutral-950 text-white border-neutral-950 font-bold shadow-lg"
                    : "bg-neutral-50/70 border-neutral-200 text-neutral-700 hover:border-neutral-900 hover:bg-white"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeDateIndicator"
                    className="absolute top-0 left-0 right-0 h-1 bg-sky-400"
                  />
                )}
                <span className="text-[10px] font-mono tracking-wider block opacity-75">
                  {d.label}
                </span>
                <span className="text-xl font-black my-0.5 block tracking-tight">
                  {d.dayNum}
                </span>
                <span className="text-[10px] font-mono block opacity-75">
                  {d.month}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* PASO 2: PLANO INTERACTIVO 2D/3D + HORARIOS */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border border-neutral-200 p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)] space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-neutral-950 text-sky-400 flex items-center justify-center font-mono text-xs font-black border border-neutral-800">
              02
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 block">
                DISTRIBUCIÓN OFICIAL DEL COMPLEJO • TOCA UNA PISTA
              </span>
              <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                {viewMode === "map"
                  ? " gemelo digital de las 3 Pistas Panorámicas"
                  : "Comparativa de Disponibilidad por Cancha"}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {viewMode === "map" && (
              <button
                type="button"
                onClick={() => setIsIsometric(!isIsometric)}
                className={`text-[11px] font-mono uppercase tracking-wider px-3.5 py-2 border flex items-center gap-1.5 transition-all cursor-pointer ${
                  isIsometric
                    ? "bg-neutral-950 border-neutral-950 text-sky-400 font-bold"
                    : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-400"
                }`}
              >
                <Box className="w-3.5 h-3.5 text-sky-400" />
                {isIsometric ? "Perspectiva 3D: ACTIVA" : "Vista Técnica 2D"}
              </button>
            )}
            <span className="text-xs text-neutral-700 font-mono bg-neutral-100 px-3.5 py-2 border border-neutral-200">
              Pista Activa:{" "}
              <strong className="text-sky-600 uppercase font-black">
                {activeCourtObj.name}
              </strong>
            </span>
          </div>
        </div>

        {viewMode === "map" ? (
          /* PLANO ARQUITECTÓNICO DE LAS 3 CANCHAS */
          <div className="bg-neutral-950 bg-tech-grid-dark p-6 sm:p-10 border border-neutral-800 relative overflow-hidden">
            {/* Escaneo láser sutil */}
            <div className="absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-sky-500/5 to-transparent pointer-events-none animate-scanline" />

            {/* Luces ambientales decorativas */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-40 bg-sky-500/15 blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400 mb-6 pb-3 border-b border-neutral-800/80">
              <span>▲ ACCESO PRINCIPAL / RECEPCIÓN & PRO-SHOP ▲</span>
              <span className="hidden sm:inline text-sky-400">
                HOMOLOGACIÓN FIP 20x10M • CRISTAL TEMPLADO 12MM
              </span>
            </div>

            <div className="perspective-courts py-2">
              <div
                className={`grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 ${
                  isIsometric ? "isometric-grid" : "flat-grid"
                }`}
              >
                {COURTS.map((court) => {
                  const isActive = selectedCourt === court.id;
                  const freeCount =
                    TIME_SLOTS.length -
                    (OCCUPIED_MAP[String(court.id)]?.length || 0);

                  return (
                    <motion.div
                      key={court.id}
                      whileHover={{ y: -6 }}
                      data-cursor={`PISTA 0${court.id}`}
                      onClick={() => handleSelectCourt(court.id)}
                      className={`cursor-pointer transition-all duration-300 relative group flex flex-col items-center ${
                        isActive
                          ? "ring-4 ring-sky-400 shadow-[0_22px_55px_rgba(14,165,233,0.38)]"
                          : "opacity-80 hover:opacity-100"
                      }`}
                    >
                      {/* Representación de la Pista Azul */}
                      <div
                        className={`w-full aspect-[1/1.88] relative flex flex-col justify-between p-4 border-2 transition-all overflow-hidden ${
                          isActive
                            ? "bg-gradient-to-b from-sky-500 via-sky-600 to-sky-700 border-white"
                            : "bg-gradient-to-b from-sky-700/85 via-sky-800/85 to-sky-900/90 border-sky-400/50 group-hover:border-white"
                        }`}
                      >
                        {/* Textura de césped y líneas reglamentarias */}
                        <div className="absolute inset-2.5 border border-white/75 pointer-events-none" />
                        <div className="absolute top-[27%] left-2.5 right-2.5 h-[1.5px] bg-white/75 pointer-events-none" />
                        <div className="absolute bottom-[27%] left-2.5 right-2.5 h-[1.5px] bg-white/75 pointer-events-none" />
                        <div className="absolute top-[27%] bottom-[27%] left-1/2 w-[1.5px] bg-white/75 -translate-x-1/2 pointer-events-none" />

                        {/* Focos LED en los laterales */}
                        <div className="absolute top-1/4 left-0 w-1.5 h-3.5 bg-white shadow-[0_0_14px_#fff]" />
                        <div className="absolute bottom-1/4 left-0 w-1.5 h-3.5 bg-white shadow-[0_0_14px_#fff]" />
                        <div className="absolute top-1/4 right-0 w-1.5 h-3.5 bg-white shadow-[0_0_14px_#fff]" />
                        <div className="absolute bottom-1/4 right-0 w-1.5 h-3.5 bg-white shadow-[0_0_14px_#fff]" />

                        {/* Red central con sombra */}
                        <div className="absolute top-1/2 left-0 right-0 h-2 bg-white/95 shadow-[0_4px_12px_rgba(0,0,0,0.45)] flex items-center justify-center -translate-y-1/2 z-10">
                          <span className="bg-neutral-950 text-white font-mono text-[8px] px-2 py-0.5 uppercase tracking-widest border border-white/40">
                            RED POWER PADEL
                          </span>
                        </div>

                        {/* Cabecera de la cancha */}
                        <div className="relative z-10 flex justify-between items-center text-white">
                          <span className="font-mono font-bold text-xs uppercase bg-neutral-950/80 backdrop-blur-xs px-2.5 py-1 border border-white/15">
                            {court.name}
                          </span>
                          {isActive ? (
                            <span className="bg-white text-neutral-950 rounded-full p-1.5 shadow-lg">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono bg-black/60 text-sky-200 px-2 py-0.5 border border-sky-400/30">
                              {freeCount} turnos libres
                            </span>
                          )}
                        </div>

                        {/* Número gigante de fondo */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                          <span className="text-white/15 font-black text-8xl font-mono tracking-tighter">
                            0{court.id}
                          </span>
                        </div>

                        {/* Pie de cancha */}
                        <div className="relative z-10 text-center">
                          <span
                            className={`text-[10px] font-mono uppercase font-bold px-3 py-1.5 inline-block tracking-wider transition-all ${
                              isActive
                                ? "bg-white text-neutral-950 shadow-md"
                                : "bg-neutral-950/75 text-white border border-white/20 group-hover:bg-white group-hover:text-neutral-950"
                            }`}
                          >
                            {isActive
                              ? "● PISTA SELECCIONADA"
                              : "SELECCIONAR PISTA"}
                          </span>
                        </div>
                      </div>

                      {/* Etiqueta inferior de cada cancha */}
                      <div className="w-full bg-neutral-900 border-x border-b border-neutral-800 p-3.5 text-center">
                        <span className="font-black text-white uppercase text-xs tracking-wider block">
                          {court.name} • {court.subtitle}
                        </span>
                        <span className="text-[11px] text-neutral-400 font-mono mt-0.5 block">
                          {court.lighting} • {court.zone}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="text-center mt-6 pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">
              <span>
                ▼ JARDÍN ARBOLADO • MESAS AL AIRE LIBRE & TERCER TIEMPO ▼
              </span>
              <span className="text-emerald-400">
                ● ILUMINACIÓN LED 800 LUX ACTIVA
              </span>
            </div>
          </div>
        ) : (
          /* VISTA RÁPIDA POR GRILLA DE HORARIOS EN LAS 3 CANCHAS */
          <div className="border border-neutral-200 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-950 text-white text-[11px] font-mono uppercase tracking-wider">
                  <th className="p-3.5 border-r border-neutral-800">Pista</th>
                  {TIME_SLOTS.map((slot) => (
                    <th
                      key={slot}
                      className="p-3.5 text-center border-r border-neutral-800"
                    >
                      {slot}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-xs font-mono">
                {COURTS.map((court) => (
                  <tr key={court.id} className="hover:bg-neutral-50">
                    <td className="p-3.5 font-bold text-neutral-900 border-r border-neutral-200 whitespace-nowrap">
                      {court.name}
                      <span className="block text-[10px] text-neutral-500 font-normal">
                        {court.subtitle}
                      </span>
                    </td>
                    {TIME_SLOTS.map((slot) => {
                      const occupied = isSlotOccupied(court.id, slot);
                      const isChosen =
                        selectedCourt === court.id && selectedSlot === slot;
                      return (
                        <td
                          key={slot}
                          className="p-1.5 border-r border-neutral-100 text-center"
                        >
                          <button
                            type="button"
                            disabled={occupied}
                            onClick={() => {
                              setSelectedCourt(court.id);
                              setSelectedSlot(slot);
                            }}
                            className={`w-full py-2.5 px-2 text-[11px] font-bold uppercase transition-all cursor-pointer ${
                              occupied
                                ? "bg-neutral-100 text-neutral-400 line-through cursor-not-allowed"
                                : isChosen
                                ? "bg-sky-600 text-white shadow-sm"
                                : "bg-emerald-50 text-emerald-800 hover:bg-neutral-950 hover:text-white"
                            }`}
                          >
                            {occupied
                              ? "Ocupado"
                              : isChosen
                              ? "Elegido"
                              : "Libre"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SELECTOR DE DURACIÓN Y HORARIOS DE LA CANCHA ACTIVA */}
        <div className="pt-2 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-100 pb-4 gap-4">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-sky-600" />
              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                Horarios Disponibles para{" "}
                <span className="text-sky-600">{activeCourtObj.name}</span> (
                {selectedDate})
              </h4>
            </div>

            <div className="inline-flex border border-neutral-900 p-0.5 bg-neutral-100 text-xs self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setDuration(60)}
                className={`px-3.5 py-1.5 font-mono font-bold uppercase transition-all cursor-pointer ${
                  duration === 60
                    ? "bg-neutral-950 text-white shadow-sm"
                    : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                60 min ($16.000)
              </button>
              <button
                type="button"
                onClick={() => setDuration(90)}
                className={`px-3.5 py-1.5 font-mono font-bold uppercase transition-all cursor-pointer ${
                  duration === 90
                    ? "bg-neutral-950 text-white shadow-sm"
                    : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                90 min ($22.000) ★
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
            {TIME_SLOTS.map((slot) => {
              const occupied = isSlotOccupied(selectedCourt, slot);
              const isSelected = selectedSlot === slot && !occupied;
              return (
                <motion.button
                  whileTap={!occupied ? { scale: 0.96 } : undefined}
                  key={slot}
                  type="button"
                  disabled={occupied}
                  data-cursor={!occupied ? "RESERVAR HORA" : undefined}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3.5 border text-center transition-all relative cursor-pointer ${
                    occupied
                      ? "bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed line-through"
                      : isSelected
                      ? "bg-neutral-950 border-neutral-950 text-white font-black ring-2 ring-sky-500 shadow-md"
                      : "bg-neutral-50 border-neutral-200 text-neutral-800 hover:border-neutral-950 hover:bg-white"
                  }`}
                >
                  <span className="text-xs font-mono font-bold block">
                    {slot} hs
                  </span>
                  <span
                    className={`text-[9px] font-mono uppercase tracking-wider block mt-1 ${
                      occupied
                        ? "text-neutral-400"
                        : isSelected
                        ? "text-sky-400"
                        : "text-emerald-600 font-semibold"
                    }`}
                  >
                    {occupied
                      ? "OCUPADO"
                      : isSelected
                      ? "SELECCIONADO"
                      : "DISPONIBLE"}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* PASO 3: ADICIONALES + TICKET DE CONFIRMACIÓN EN VIVO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 bg-white border border-neutral-200 p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)] space-y-6"
        >
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-neutral-950 text-sky-400 flex items-center justify-center font-mono text-xs font-black border border-neutral-800">
                03
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-sky-600 font-bold block">
                  SERVICIO TEST & RENT EN RECEPCIÓN
                </span>
                <h3 className="text-xs font-black uppercase tracking-[0.15em] text-neutral-900">
                  Equipamiento Oficial para tu Partido
                </h3>
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase bg-sky-50 text-sky-700 px-2.5 py-1 border border-sky-200 font-bold">
              Entrega en Pista
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Selector de cantidad de paletas */}
            <div
              className={`p-5 border transition-all flex flex-col justify-between ${
                racketCount > 0
                  ? "border-neutral-950 bg-neutral-50 ring-1 ring-neutral-950"
                  : "border-neutral-200 bg-white hover:border-neutral-400"
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <p className="font-black text-xs uppercase tracking-wide text-neutral-900">
                    Alquiler de Paleta Oficial
                  </p>
                  <span className="text-xs font-mono font-bold text-sky-600">
                    +$4.000 c/u
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed mb-4">
                  Modelos Power Padel de carbono con overgrip nuevo y protector
                  instalado.
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-200/80">
                <span className="text-[11px] font-mono font-bold text-neutral-700 uppercase">
                  Cantidad de paletas:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRacketCount(Math.max(0, racketCount - 1))}
                    className="w-7 h-7 border border-neutral-300 bg-white hover:bg-neutral-100 flex items-center justify-center text-neutral-900 cursor-pointer"
                    aria-label="Restar paleta"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center font-mono font-black text-sm">
                    {racketCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setRacketCount(Math.min(4, racketCount + 1))}
                    className="w-7 h-7 border border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800 flex items-center justify-center cursor-pointer"
                    aria-label="Sumar paleta"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tubo de pelotas presurizado */}
            <div
              onClick={() => setIncludeBalls(!includeBalls)}
              className={`p-5 border cursor-pointer transition-all flex flex-col justify-between ${
                includeBalls
                  ? "border-neutral-950 bg-neutral-50 ring-1 ring-neutral-950"
                  : "border-neutral-200 bg-white hover:border-neutral-400"
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <p className="font-black text-xs uppercase tracking-wide text-neutral-900">
                    Tubo de Pelotas Pro (x3)
                  </p>
                  <span
                    className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-colors ${
                      includeBalls
                        ? "bg-neutral-950 border-neutral-950 text-white"
                        : "border-neutral-300 bg-white"
                    }`}
                  >
                    {includeBalls && <Check className="w-3.5 h-3.5" />}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed mb-4">
                  Bote presurizado sellado Power Padel Pro Tour homologado para
                  estrenar en tu turno.
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-200/80 flex justify-between items-center">
                <span className="text-[11px] font-mono text-neutral-500 uppercase">
                  Venta directa
                </span>
                <span className="text-xs font-mono font-black text-neutral-900">
                  +$7.500 ARS
                </span>
              </div>
            </div>
          </div>

          {/* Divisor de tarifa entre jugadores */}
          <div className="bg-neutral-950 text-white p-5 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-500/10 border border-sky-500/30 text-sky-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-sky-400 block">
                  SPLIT-PAY CALCULATOR
                </span>
                <p className="text-xs font-bold text-white">
                  Dividir el total del turno entre jugadores:
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="inline-flex border border-neutral-700 bg-neutral-900 p-0.5">
                {[2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSplitPlayers(num)}
                    className={`px-3 py-1 text-xs font-mono font-bold transition-colors cursor-pointer ${
                      splitPlayers === num
                        ? "bg-sky-500 text-neutral-950"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {num} Jug.
                  </button>
                ))}
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] text-neutral-400 block uppercase">
                  Cada uno abona
                </span>
                <span className="text-lg font-black text-sky-400">
                  ${perPlayerCost.toLocaleString("es-AR")} ARS
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RESUMEN DE RESERVA Y BOARDING PASS DIGITAL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-5 bg-neutral-950 text-white p-6 sm:p-8 border border-neutral-800 space-y-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-sky-500/10 blur-3xl pointer-events-none" />

          <AnimatePresence mode="wait">
            {!bookingConfirmed ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <div className="border-b border-neutral-800 pb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-sky-400 block mb-0.5">
                      CONFIRMACIÓN INMEDIATA • PAGO EN CLUB
                    </span>
                    <h4 className="text-lg font-black tracking-wider uppercase text-white">
                      Pase Oficial de Turno
                    </h4>
                  </div>
                  <ShieldCheck className="w-6 h-6 text-sky-400 shrink-0" />
                </div>

                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between py-1.5 border-b border-neutral-800/80">
                    <span className="text-neutral-400">Pista Oficial:</span>
                    <span className="font-bold text-sky-400 uppercase">
                      {activeCourtObj.name} ({activeCourtObj.subtitle})
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-800/80">
                    <span className="text-neutral-400">Fecha:</span>
                    <span className="text-white font-bold">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-800/80">
                    <span className="text-neutral-400">Horario & Duración:</span>
                    <span className="font-bold text-white">
                      {selectedSlot} hs ({duration} min)
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-800/80">
                    <span className="text-neutral-400">Valor de Cancha:</span>
                    <span className="text-white">
                      ${courtPrice.toLocaleString("es-AR")} ARS
                    </span>
                  </div>

                  {(racketCount > 0 || includeBalls) && (
                    <div className="py-2 border-b border-neutral-800/80 space-y-1.5">
                      <span className="text-[10px] text-sky-400 uppercase tracking-wider block font-bold">
                        Adicionales Seleccionados:
                      </span>
                      {racketCount > 0 && (
                        <div className="flex justify-between text-[11px] text-neutral-300">
                          <span>
                            • {racketCount}x Alquiler de Paleta Oficial
                          </span>
                          <span>+${racketsTotal.toLocaleString("es-AR")}</span>
                        </div>
                      )}
                      {includeBalls && (
                        <div className="flex justify-between text-[11px] text-neutral-300">
                          <span>• Tubo de Pelotas Oficial (x3)</span>
                          <span>+$7.500</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-3 flex justify-between items-baseline font-mono">
                    <div>
                      <span className="text-xs text-neutral-400 uppercase block">
                        Total en Recepción:
                      </span>
                      <span className="text-[11px] text-sky-400">
                        (${perPlayerCost.toLocaleString("es-AR")} por jugador x
                        {splitPlayers})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-black text-white">
                        ${grandTotal.toLocaleString("es-AR")}
                      </span>
                      <span className="text-xs text-neutral-400 ml-1">ARS</span>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handleConfirmBooking}
                  className="space-y-3.5 pt-2"
                >
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                      Nombre y Apellido del Responsable *
                    </label>
                    <input
                      type="text"
                      required
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Ej: Tomás Basabe"
                      className="w-full bg-neutral-900 border border-neutral-700 p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-sky-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                      WhatsApp para emitir Boarding Pass *
                    </label>
                    <input
                      type="tel"
                      required
                      value={playerPhone}
                      onChange={(e) => setPlayerPhone(e.target.value)}
                      placeholder="+54 9 261 123-4567"
                      className="w-full bg-neutral-900 border border-neutral-700 p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-sky-400 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!playerName.trim() || !playerPhone.trim()}
                    className="w-full bg-sky-500 hover:bg-sky-400 text-neutral-950 font-black text-xs uppercase tracking-[0.18em] py-4 px-4 transition-all disabled:opacity-40 disabled:pointer-events-none mt-2 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    Emitir Pase para {activeCourtObj.name}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <p className="text-[10px] text-neutral-400 text-center font-mono uppercase tracking-wider">
                  Pago presencial en efectivo, transferencia o Mercado Pago al
                  llegar.
                </p>
              </motion.div>
            ) : (
              /* BOARDING PASS DIGITAL DE RESERVA CONFIRMADA */
              <motion.div
                key="voucher"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-5 py-1"
              >
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 text-neutral-950 flex items-center justify-center font-black shrink-0">
                      <Check className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block font-bold">
                        BOARDING PASS EMITIDO
                      </span>
                      <h4 className="text-sm font-black uppercase text-white">
                        REF: {bookingConfirmed.code}
                      </h4>
                    </div>
                  </div>
                  <QrCode className="w-9 h-9 text-emerald-400 shrink-0" />
                </div>

                <div className="bg-neutral-900 border border-neutral-800 p-5 space-y-2.5 font-mono text-xs relative">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Titular:</span>
                    <span className="text-white font-bold uppercase">
                      {playerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Pista asignada:</span>
                    <span className="text-sky-400 font-bold uppercase">
                      {bookingConfirmed.court}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Fecha y Hora:</span>
                    <span className="text-white font-bold">
                      {bookingConfirmed.date} • {bookingConfirmed.slot} hs (
                      {bookingConfirmed.duration}m)
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-dashed border-neutral-700">
                    <span className="text-neutral-400">Total en Club:</span>
                    <span className="text-emerald-400 font-black">
                      ${bookingConfirmed.total.toLocaleString("es-AR")} ARS
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <a
                    href={`https://wa.me/5491112345678?text=${encodeURIComponent(
                      `¡Hola Power Padel! Acabo de emitir mi pase web.\n• Código: ${bookingConfirmed.code}\n• Jugador: ${playerName}\n• Pista: ${bookingConfirmed.court}\n• Fecha: ${bookingConfirmed.date} a las ${bookingConfirmed.slot} hs (${bookingConfirmed.duration} min)\n• Total: $${bookingConfirmed.total.toLocaleString("es-AR")} ARS`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-white hover:bg-sky-400 text-neutral-950 font-black text-xs uppercase tracking-[0.15em] py-3.5 px-4 flex items-center justify-center gap-2 transition-colors font-mono"
                  >
                    <Share2 className="w-4 h-4" />
                    Enviar Pase a Recepción por WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => setBookingConfirmed(null)}
                    className="w-full border border-neutral-700 hover:border-white text-neutral-300 hover:text-white text-xs font-mono uppercase tracking-wider py-2.5 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Realizar otra reserva
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
