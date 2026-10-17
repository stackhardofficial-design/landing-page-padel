"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import {
  ShoppingBag,
  ChevronDown,
  Pause,
  Play,
  Check,
  Trophy,
  Flame,
  Wine,
  MapPin,
  ExternalLink,
  Navigation,
  Clock,
  Shield,
  X,
  SlidersHorizontal,
  ArrowUpRight,
  Trash2,
  Menu,
  Sun,
  Moon,
  Crosshair,
  Layers,
  Zap,
} from "lucide-react";
import BookingSystem from "@/components/BookingSystem";
import { Globe } from "@/components/ui/globe";
import {
  LuxuryPreloader,
  CustomCursor,
  RevealImage,
  SplitTextReveal,
  TiltCard,
  Magnetic,
  AnimatedCounter,
  RadarTelemetry,
} from "@/components/ui/LuxuryMotion";

interface Product {
  id: string;
  name: string;
  category: "paletas" | "pelotas";
  styleTag: "polivalente" | "potencia" | "control" | "accesorio";
  badge: string;
  image: string;
  price: number;
  rentPrice?: number;
  specs: {
    shape: string;
    balance: string;
    weight: string;
    core: string;
    surface: string;
    power: number;
    control: number;
    rebound: number;
    spin: number;
    sweetspot: number;
    description: string;
  };
}

const PRODUCTS: Product[] = [
  {
    id: "witch-blue",
    name: "Power Padel WITCH BLUE Rugosa",
    category: "paletas",
    styleTag: "polivalente",
    badge: "MÁS POPULAR",
    image: "/pala-witch-blue.jpg",
    price: 249950,
    rentPrice: 4000,
    specs: {
      shape: "Lágrima Oversize",
      balance: "Medio - Polivalente",
      weight: "365g ± 5g",
      core: "Goma EVA Soft de Alta Recuperación",
      surface: "Carbono 3K + Acabado Rugoso Arena",
      power: 90,
      control: 94,
      rebound: 92,
      spin: 96,
      sweetspot: 93,
      description:
        "Diseñada para jugadores que buscan efecto cortado en víboras y bandejas sin perder salida de bola desde el fondo de la pista.",
    },
  },
  {
    id: "emerald",
    name: "Power Padel EMERALD Carbon",
    category: "paletas",
    styleTag: "potencia",
    badge: "GAMA PREMIUM",
    image: "/pala-emerald.jpg",
    price: 270000,
    rentPrice: 4000,
    specs: {
      shape: "Híbrida Pro",
      balance: "Medio-Alto",
      weight: "370g ± 5g",
      core: "EVA Pro Multidensidad",
      surface: "Carbono 12K Visto",
      power: 96,
      control: 91,
      rebound: 94,
      spin: 94,
      sweetspot: 90,
      description:
        "El buque insignia de la línea Power Padel. Estructura reforzada que maximiza la transferencia de energía en remates x3 y voleas agresivas.",
    },
  },
  {
    id: "white-rugosa",
    name: "Power Padel WHITE Rugosa",
    category: "paletas",
    styleTag: "control",
    badge: "CONFORT & CONTROL",
    image: "/pala-white.jpg",
    price: 209950,
    rentPrice: 4000,
    specs: {
      shape: "Redonda",
      balance: "Bajo (Manejabilidad Total)",
      weight: "360g ± 5g",
      core: "EVA Ultra Soft Antivibración",
      surface: "Fibra de Vidrio + Carbono Rugoso",
      power: 84,
      control: 98,
      rebound: 95,
      spin: 93,
      sweetspot: 98,
      description:
        "Punto dulce amplificado y absorción superior de vibraciones para cuidar el codo en partidos intensos de 90 minutos.",
    },
  },
  {
    id: "textrem-red",
    name: "Power Padel TEXTREM SOFT Red",
    category: "paletas",
    styleTag: "potencia",
    badge: "POTENCIA PURA",
    image: "/pala-textrem-red.jpg",
    price: 239950,
    rentPrice: 4000,
    specs: {
      shape: "Diamante",
      balance: "Alto",
      weight: "372g ± 5g",
      core: "EVA Soft Reactiva",
      surface: "Tejido Carbono Textrem Rojo",
      power: 98,
      control: 87,
      rebound: 91,
      spin: 92,
      sweetspot: 86,
      description:
        "Pala de ataque puro con plano de carbono Textrem entrelazado para máxima velocidad de pelota en la red.",
    },
  },
  {
    id: "tubo-pelotas",
    name: "Tubo de Pelotas Power Padel Pro (x3)",
    category: "pelotas",
    styleTag: "accesorio",
    badge: "VENTA DIRECTA",
    image: "/pote-pelotas.jpg",
    price: 7500,
    specs: {
      shape: "Tubo Presurizado x3",
      balance: "Homologación ITF Pro Tour",
      weight: "58.5g Oficial",
      core: "Caucho de Alta Densidad",
      surface: "Fieltro Premium de Alta Visibilidad",
      power: 95,
      control: 95,
      rebound: 98,
      spin: 94,
      sweetspot: 100,
      description:
        "Bote consistente y durabilidad extendida sobre césped sintético con arena de sílice.",
    },
  },
];

const HERO_SLIDES = [
  {
    image: "/pres2.png",
    tag: "COLECCIÓN OFICIAL & COMPLEJO DEPORTIVO",
    title: "LA NUEVA GENERACIÓN DE PALAS POWER PADEL",
    subtitle:
      "Ingeniería en carbono de alto módulo y 3 pistas panorámicas de césped azul homologadas para jugadores que exigen rendimiento real.",
  },
  {
    image: "/canchas-atardecer.png",
    tag: "3 PISTAS PANORÁMICAS • MENDOZA",
    title: "CÉSPED AZUL PROFESIONAL & TERCER TIEMPO",
    subtitle:
      "Reservá tu turno online en segundos. Iluminación LED de 800 lux, servicio Test & Rent en recepción y sector lounge al aire libre.",
  },
  {
    image: "/canchas-aerea.png",
    tag: "ARQUITECTURA DEPORTIVA HOMOLOGADA FIP",
    title: "EXPERIENCIA DE CLUB PRIVADO SIN FRICCIONES",
    subtitle:
      "Cristal templado de 12mm, retiro perimetral reglamentario, estacionamiento privado vigilado y gastronomía en nuestro jardín arbolado.",
  },
];

const COURT_HOTSPOTS = [
  {
    id: "glass",
    x: "24%",
    y: "36%",
    title: "Cristal Templado 12mm Full-View",
    detail:
      "Cerramiento perimetral acústico con herrajes enrasados que garantizan rebote limpio y visión panorámica 360° desde el lounge.",
    metric: "12 MM",
  },
  {
    id: "turf",
    x: "52%",
    y: "68%",
    title: "Césped Monofilamento Azul WPT",
    detail:
      "Fibras texturizadas con memoria elástica y dosificación controlada de sílice redondeada para máxima tracción sin abrasión articular.",
    metric: "100% GRIP",
  },
  {
    id: "led",
    x: "76%",
    y: "22%",
    title: "Torres LED Asimétricas 800 Lux",
    detail:
      "Óptica deportiva proyectada a 6 metros de altura que elimina el deslumbramiento en globos altos y remates nocturnos.",
    metric: "800 LUX",
  },
];

const FAQS = [
  {
    q: "¿Cómo se reserva una cancha de pádel?",
    a: "Eliges la cancha (1, 2 o 3), el día y el horario en el reservador interactivo de la web. Ingresas tu nombre y teléfono y tu turno queda confirmado al instante con un Boarding Pass oficial en pesos argentinos ($16.000 ARS por 60 min o $22.000 ARS por 90 min).",
  },
  {
    q: "¿Cuánto dura cada turno de juego y qué precios tienen?",
    a: "Disponemos de turnos de 60 minutos ($16.000 ARS total cancha) y de 90 minutos ($22.000 ARS total cancha). Si juegan 4 personas en un turno de 90 minutos, cada jugador abona solo $5.500 ARS.",
  },
  {
    q: "¿Alquilan paletas y venden pelotas en el complejo?",
    a: "Sí. Contamos con servicio Test & Rent de paletas oficiales Power Padel a $4.000 ARS por turno con overgrip nuevo, y tubos sellados de 3 pelotas presurizadas a $7.500 ARS.",
  },
  {
    q: "¿Se pueden comprar paletas nuevas en el complejo?",
    a: "Sí, somos punto oficial Power Padel. Si alquilaste una pala para probarla en tu partido y decides comprarla nueva al terminar, te descontamos el 100% del valor del alquiler del precio final.",
  },
  {
    q: "¿Qué sucede si llueve el día de mi turno?",
    a: "En caso de lluvia o humedad en los cristales que impida el juego seguro, reprogramamos tu turno sin cargo alguno o te asistimos directamente por WhatsApp desde recepción.",
  },
  {
    q: "¿El complejo cuenta con iluminación nocturna?",
    a: "Las 3 canchas cuentan con torres de iluminación LED asimétrica de alta potencia (800 lux) que garantizan visión nítida sin encandilamiento hasta las 23:30 hs.",
  },
  {
    q: "¿Hay lugar para el tercer tiempo después de jugar?",
    a: "Por supuesto. Tenemos un jardín arbolado contiguo a la Cancha 3 con mesas al aire libre, bebidas frías, cafetería y sector de asador.",
  },
  {
    q: "¿Se puede alquilar el complejo completo para eventos o torneos de empresas?",
    a: "Sí, ofrecemos paquetes exclusivos donde cerramos las 3 pistas para tu empresa o festejo privado, incluyendo coordinación de fixture, trofeos, uso del quincho con parrillero y barra de bebidas.",
  },
];

export default function PadelLandingPage() {
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 30,
    restDelta: 0.001,
  });

  // Parallax del Hero
  const heroRef = useRef<HTMLElement>(null);
  const heroY = useTransform(scrollY, [0, 900], ["0%", "28%"]);
  const heroScale = useTransform(scrollY, [0, 900], [1.02, 1.15]);
  const heroTextOpacity = useTransform(scrollY, [0, 520], [1, 0]);
  const heroTextY = useTransform(scrollY, [0, 520], [0, 65]);

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 60);
    });
    return () => unsubscribe();
  }, [scrollY]);

  // Simulador lumínico y puntos técnicos de pista
  const [lightingMode, setLightingMode] = useState<"day" | "night">("night");
  const [activeHotspot, setActiveHotspot] = useState<string>("led");

  // Tienda, Filtros, Modal Técnico y Carrito
  const [storeFilter, setStoreFilter] = useState<
    "all" | "paletas" | "pelotas" | "rent"
  >("all");
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(
    null
  );
  const [cart, setCart] = useState<
    { product: Product; mode: "buy" | "rent"; qty: number }[]
  >([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredProducts = PRODUCTS.filter((p) => {
    if (storeFilter === "all") return true;
    if (storeFilter === "paletas") return p.category === "paletas";
    if (storeFilter === "pelotas") return p.category === "pelotas";
    if (storeFilter === "rent") return Boolean(p.rentPrice);
    return true;
  });

  const addToCart = (product: Product, mode: "buy" | "rent") => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.mode === mode
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].qty += 1;
        return updated;
      }
      return [...prev, { product, mode, qty: 1 }];
    });
    setActiveProductModal(null);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, mode: "buy" | "rent") => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.mode === mode)
      )
    );
  };

  const cartTotal = cart.reduce((acc, item) => {
    const unitPrice =
      item.mode === "rent"
        ? item.product.rentPrice || item.product.price
        : item.product.price;
    return acc + unitPrice * item.qty;
  }, 0);

  const [eventType, setEventType] = useState("Torneo Corporativo");
  const [eventGuests, setEventGuests] = useState("16 a 32 jugadores");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const navLinks = [
    { href: "#reservas", label: "Reservas" },
    { href: "#canchas", label: "Pistas" },
    { href: "#ingenieria", label: "Telemetría" },
    { href: "#tienda-alquiler", label: "Pro-Shop" },
    { href: "#complejo", label: "El Club" },
    { href: "#eventos", label: "Eventos" },
    { href: "#ubicacion", label: "Ubicación" },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      {/* PRELOADER DE INGENIERÍA */}
      <LuxuryPreloader />

      {/* CURSOR INERCIAL CONTEXTUAL */}
      <CustomCursor />

      {/* BARRA SUPERIOR DE PROGRESO DE LECTURA */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-sky-400 via-sky-500 to-white origin-left z-[70]"
      />

      {/* SMART HEADER CON TRANSICIÓN GLASSMORPHISM */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-neutral-950/92 backdrop-blur-xl border-b border-white/10 h-20 shadow-2xl"
            : "bg-gradient-to-b from-black/90 via-black/45 to-transparent h-24"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-full flex items-center justify-between">
          <nav className="hidden lg:flex items-center space-x-7 text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-neutral-300">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative py-1 hover:text-white transition-colors group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-sky-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <Magnetic strength={0.2}>
            <a
              href="#"
              className="flex items-center justify-center py-2"
              data-cursor="INICIO"
            >
              <img
                src="/logo.png"
                alt="Power Padel Logo"
                className="h-10 sm:h-11 w-auto object-contain filter invert brightness-200"
              />
            </a>
          </Magnetic>

          <div className="flex items-center space-x-3 sm:space-x-5 text-white">
            <div className="hidden xl:flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>CLUB OPERATIVO</span>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              data-cursor="BOLSA"
              className="hover:text-sky-400 transition-colors p-2 relative cursor-pointer"
              aria-label="Bolsa de Compras"
            >
              <ShoppingBag className="w-4 h-4 stroke-[1.8]" />
              {cart.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-sky-500 text-neutral-950 font-mono text-[10px] font-black flex items-center justify-center">
                  {cart.reduce((sum, i) => sum + i.qty, 0)}
                </span>
              )}
            </button>

            <Magnetic strength={0.22}>
              <a
                href="#reservas"
                data-cursor="RESERVAR"
                className="hidden sm:block bg-sky-500 hover:bg-sky-400 text-neutral-950 font-mono font-black text-[11px] uppercase tracking-[0.18em] px-5 py-2.5 transition-all shadow-[0_0_25px_rgba(14,165,233,0.35)]"
              >
                Reservar Turno
              </a>
            </Magnetic>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:text-sky-400 transition-colors cursor-pointer"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Menú desplegable móvil */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-neutral-950/98 backdrop-blur-2xl border-b border-neutral-800 overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col space-y-4 font-mono text-xs uppercase tracking-[0.2em] text-neutral-200">
                {navLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 border-b border-neutral-800/80 hover:text-sky-400 flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-4 h-4 text-sky-400" />
                  </a>
                ))}
                <a
                  href="#reservas"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-sky-500 text-neutral-950 font-black py-3.5 text-center tracking-[0.2em] mt-2"
                >
                  Reservar Cancha Online
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION DE IMPACTO CON IMAGEN FIJA Y TEXTO CENTRADO */}
      <section
        ref={heroRef}
        className="relative w-full h-screen min-h-[740px] max-h-[1100px] bg-neutral-950 text-white overflow-hidden flex items-center justify-center pt-20 pb-16"
      >
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <img
            src="/pres2.png"
            alt="La Nueva Generación de Palas Power Padel"
            className="w-full h-full object-cover object-center brightness-[0.78] contrast-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/45 to-black/70 pointer-events-none" />
          <div className="absolute inset-0 bg-luxury-noise pointer-events-none" />
        </motion.div>

        <motion.div
          style={{ opacity: heroTextOpacity, y: heroTextY }}
          className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10 w-full flex flex-col items-center text-center"
        >
          <div className="space-y-6 flex flex-col items-center text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 bg-neutral-950/80 backdrop-blur-md border border-sky-400/35 px-4 py-1.5 text-[10px] font-mono uppercase tracking-[0.28em] text-sky-300 font-bold mx-auto"
            >
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              COLECCIÓN OFICIAL & COMPLEJO DEPORTIVO
            </motion.div>

            <div className="flex justify-center text-center w-full">
              <SplitTextReveal
                as="h1"
                text="LA NUEVA GENERACIÓN DE PALAS POWER PADEL"
                className="text-4xl sm:text-6xl lg:text-[4.65rem] font-extrabold uppercase text-white leading-[0.98] tracking-tight text-center"
              />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.25 }}
              className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-2xl mx-auto text-center"
            >
              Ingeniería en carbono de alto módulo y 3 pistas panorámicas de
              césped azul homologadas para jugadores que exigen rendimiento real.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.35 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-2"
            >
              <Magnetic strength={0.18}>
                <a
                  href="#reservas"
                  data-cursor="TURNOS"
                  className="bg-white hover:bg-sky-400 text-neutral-950 font-mono uppercase tracking-[0.22em] text-xs py-4 px-8 transition-colors font-black shadow-2xl flex items-center gap-2.5"
                >
                  RESERVAR CANCHA AHORA
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </Magnetic>
              <Magnetic strength={0.18}>
                <a
                  href="#tienda-alquiler"
                  data-cursor="PRO-SHOP"
                  className="border border-white/40 hover:border-white bg-black/40 hover:bg-black/70 text-white font-mono uppercase tracking-[0.22em] text-xs py-4 px-8 transition-colors backdrop-blur-md font-bold block"
                >
                  EXPLORAR CATÁLOGO PRO
                </a>
              </Magnetic>
            </motion.div>
          </div>
        </motion.div>

        {/* Indicador inferior de scroll centrado */}
        <div className="absolute bottom-7 inset-x-0 mx-auto z-20 flex justify-center">
          <a
            href="#reservas"
            className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-300 hover:text-white bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
          >
            <span>SCROLL EXPERIENCE</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-sky-400" />
          </a>
        </div>
      </section>

      {/* BANDA DE TELEMETRÍA CON CONTADORES ANIMADOS (ODÓMETRO) */}
      <div className="bg-neutral-950 border-t border-neutral-800 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-neutral-800 border-x border-neutral-800">
          {[
            {
              val: 3,
              suffix: " PISTAS",
              label: "Panorámicas Full-Glass Homologadas",
              tag: "FIP 20x10M",
            },
            {
              val: 800,
              suffix: " LUX",
              label: "Iluminación LED Asimétrica Nocturna",
              tag: "CERO ENCANDILAMIENTO",
            },
            {
              val: 12,
              suffix: " MM",
              label: "Cristal Templado Acústico de Seguridad",
              tag: "REBOTE UNIFORME",
            },
            {
              val: 100,
              suffix: "%",
              label: "Reintegro del Alquiler al Comprar tu Pala",
              tag: "PROGRAMA TRY & BUY",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-6 sm:p-8 bg-carbon-weave hover:bg-neutral-900/80 transition-colors"
            >
              <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-sky-400 block mb-2 font-bold">
                ● {stat.tag}
              </span>
              <div className="font-mono text-3xl sm:text-4xl font-black text-white tracking-tight">
                <AnimatedCounter value={stat.val} suffix={stat.suffix} />
              </div>
              <p className="text-xs text-neutral-400 mt-1.5 leading-snug">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* MARQUEE DEPORTIVO DE ESPECIFICACIONES */}
      <div className="bg-neutral-950 border-y border-neutral-800 py-4 overflow-hidden select-none">
        <div className="animate-marquee-smooth flex items-center gap-12 text-[11px] font-mono uppercase tracking-[0.26em] text-neutral-300">
          {[...Array(2)].map((_, idx) => (
            <React.Fragment key={idx}>
              <span className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full" />3 PISTAS
                PANORÁMICAS FULL GLASS 12MM
              </span>
              <span className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
                CÉSPED MONOFILAMENTO AZUL HOMOLOGADO
              </span>
              <span className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
                TEST & RENT DE PALAS EN RECEPCIÓN ($4.000 ARS)
              </span>
              <span className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
                ILUMINACIÓN LED 800 LUX SIN PUNTOS CIEGOS
              </span>
              <span className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
                PELOTAS OFICIALES POWER PADEL PRO TOUR ITF
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* SECCIÓN 01: RESERVAS ONLINE */}
      <section
        id="reservas"
        className="py-28 border-b border-neutral-200 bg-neutral-100 bg-tech-grid-light relative"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-neutral-950 text-sky-400 px-3.5 py-1 text-[10px] font-mono uppercase tracking-[0.22em] font-bold mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                01 • SISTEMA DE TURNOS EN DIRECTO
              </div>
              <SplitTextReveal
                text="RESERVA TU CANCHA Y HORARIO"
                className="text-3xl sm:text-5xl font-extrabold uppercase text-neutral-950 leading-[1.02]"
              />
            </div>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs sm:text-sm text-neutral-600 max-w-md font-mono leading-relaxed"
            >
              Explorá las 3 pistas en el gemelo digital 3D/2D, dividí la tarifa
              entre los 4 jugadores y emití tu Boarding Pass al instante.
            </motion.p>
          </div>

          <BookingSystem />
        </div>
      </section>

      {/* SECCIÓN 02: INSTALACIONES CON REVEAL IMAGE + TILT 3D */}
      <section
        id="canchas"
        className="py-28 border-b border-neutral-200 bg-white"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4 border-b border-neutral-200 pb-8">
            <div>
              <span className="text-xs font-mono text-sky-600 font-bold uppercase tracking-[0.22em] block mb-2">
                02 • ARQUITECTURA DEPORTIVA
              </span>
              <SplitTextReveal
                text="NUESTRAS 3 CANCHAS OFICIALES"
                className="text-3xl sm:text-5xl font-extrabold uppercase text-neutral-950 leading-[1.02]"
              />
            </div>
            <p className="text-xs text-neutral-500 max-w-md font-mono leading-relaxed">
              Tres pistas contiguas con superficie azul de máxima adherencia,
              cerramiento panorámico de cristal templado y reflectores LED de
              alta potencia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                badge: "CANCHA PRINCIPAL",
                name: "Cancha 1",
                img: "/canchas-frontal.png",
                desc: "Cancha frontal con iluminación directa y excelente visibilidad perimetral.",
                features: [
                  "Césped sintético azul profesional de alto agarre",
                  "Cerramiento perimetral de cristal templado 12mm",
                  "Reflectores LED en altura para máxima visibilidad nocturna",
                  "Zona amplia para juego exterior reglamentario",
                ],
              },
              {
                badge: "CANCHA CENTRAL",
                name: "Cancha 2",
                img: "/canchas-lateral.png",
                desc: "Ubicada en el corazón del complejo con cercanía al lounge y sector verde.",
                features: [
                  "Rebote uniforme y amortiguación articular superior",
                  "Cristales laterales de seguridad de alta resistencia",
                  "Iluminación asimétrica de 800 lux sin puntos ciegos",
                  "Acceso directo desde recepción y pro-shop",
                ],
              },
              {
                badge: "CANCHA PARQUE",
                name: "Cancha 3",
                img: "/canchas-atardecer.png",
                desc: "Orientación ideal para disfrutar del atardecer mendocino y partidos nocturnos.",
                features: [
                  "Superficie azul con dosificación exacta de sílice",
                  "Entorno arbolado al aire libre y excelente acústica",
                  "Focos LED de alta potencia para horario nocturno",
                  "Contigua a las mesas del jardín para el tercer tiempo",
                ],
              },
            ].map((c, idx) => (
              <TiltCard
                key={c.name}
                cursorText="PISTA OFICIAL"
                maxTilt={4.5}
                className="bg-white border border-neutral-200 flex flex-col justify-between transition-all duration-300 hover:border-neutral-950 hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)]"
              >
                <div>
                  <div className="relative h-72 w-full overflow-hidden">
                    <RevealImage
                      src={c.img}
                      alt={c.name}
                      delay={idx * 0.12}
                      parallaxOffset={20}
                      className="w-full h-full"
                    />
                    <div className="absolute top-3 left-3 z-30 bg-neutral-950/90 backdrop-blur-xs text-white text-[10px] font-mono uppercase px-3 py-1 tracking-wider font-bold border border-white/15">
                      {c.badge}
                    </div>
                  </div>
                  <div className="p-7 space-y-4">
                    <div>
                      <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-neutral-950 group-hover:text-sky-600 transition-colors">
                        {c.name}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                        {c.desc}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-neutral-100 space-y-2.5">
                      {c.features.map((feat) => (
                        <div
                          key={feat}
                          className="flex items-center gap-2.5 text-xs text-neutral-700"
                        >
                          <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-7 pt-4 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/70">
                  <span className="text-xs font-mono font-bold text-neutral-700">
                    Desde $16.000 ARS
                  </span>
                  <a
                    href="#reservas"
                    data-cursor="RESERVAR"
                    className="bg-neutral-950 hover:bg-sky-600 text-white font-mono font-bold text-xs uppercase tracking-wider py-2.5 px-4 transition-colors"
                  >
                    Reservar Pista
                  </a>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* NUEVA SECCIÓN 02.5: TELEMETRÍA INTERACTIVA DE PISTA (MODO DÍA / NOCHE 800 LUX & HOTSPOTS) */}
      <section
        id="ingenieria"
        className="py-28 border-b border-neutral-800 bg-neutral-950 bg-tech-grid-dark text-white relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-6 border-b border-neutral-800 pb-8">
            <div>
              <div className="inline-flex items-center gap-2 border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-[10px] font-mono tracking-[0.22em] uppercase text-sky-400 font-bold mb-3">
                <Crosshair className="w-3.5 h-3.5 text-sky-400" />
                INGENIERÍA ACÚSTICA & LUMÍNICA
              </div>
              <SplitTextReveal
                text="SIMULADOR DE CONDICIONES DE PISTA"
                className="text-3xl sm:text-5xl font-extrabold uppercase text-white leading-[1.02]"
              />
            </div>

            {/* Conmutador interactivo Luz Natural vs Nocturno 800 Lux */}
            <div className="inline-flex border border-neutral-700 bg-neutral-900 p-1 self-start lg:self-auto">
              <button
                type="button"
                onClick={() => setLightingMode("day")}
                className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                  lightingMode === "day"
                    ? "bg-white text-neutral-950 shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                Luz Solar / Atardecer
              </button>
              <button
                type="button"
                onClick={() => setLightingMode("night")}
                className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                  lightingMode === "night"
                    ? "bg-sky-500 text-neutral-950 shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                Nocturno 800 Lux LED
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Visor Interactivo con Hotspots Pulsantes */}
            <div className="lg:col-span-8 relative min-h-[380px] sm:min-h-[460px] border border-neutral-800 overflow-hidden bg-neutral-900 group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={lightingMode}
                  src={
                    lightingMode === "day"
                      ? "/canchas-frontal.png"
                      : "/canchas-atardecer.png"
                  }
                  alt="Simulación de pista Power Padel"
                  initial={{ opacity: 0.2, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.2 }}
                  transition={{ duration: 0.6 }}
                  className={`w-full h-full object-cover absolute inset-0 ${
                    lightingMode === "night"
                      ? "brightness-95 contrast-115 saturate-110"
                      : "brightness-105 contrast-105"
                  }`}
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/20 to-transparent pointer-events-none" />

              {/* Puntos de inspección técnica (Hotspots) */}
              {COURT_HOTSPOTS.map((spot) => {
                const isSelected = activeHotspot === spot.id;
                return (
                  <button
                    key={spot.id}
                    type="button"
                    style={{ left: spot.x, top: spot.y }}
                    onClick={() => setActiveHotspot(spot.id)}
                    data-cursor="INSPECCIONAR"
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group/spot"
                  >
                    <span className="relative flex h-9 w-9 items-center justify-center">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          isSelected ? "bg-sky-400" : "bg-white/60"
                        }`}
                      />
                      <span
                        className={`relative inline-flex rounded-full h-7 w-7 items-center justify-center font-mono text-[10px] font-black border transition-transform group-hover/spot:scale-110 ${
                          isSelected
                            ? "bg-sky-400 text-neutral-950 border-white scale-110"
                            : "bg-neutral-950/90 text-white border-white/50"
                        }`}
                      >
                        +
                      </span>
                    </span>
                  </button>
                );
              })}

              {/* HUD inferior sobre la imagen */}
              <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-wrap items-center justify-between gap-4 bg-neutral-950/90 backdrop-blur-md border border-white/15 px-5 py-3.5 text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  <span className="text-neutral-300 uppercase">
                    MODO ACTIVO:{" "}
                    <strong className="text-white">
                      {lightingMode === "night"
                        ? "TORRES LED ASIMÉTRICAS 800 LUX"
                        : "ORIENTACIÓN NORTE-SUR SIN SOL FRONTAL"}
                    </strong>
                  </span>
                </div>
                <span className="text-sky-400 text-[11px]">
                  HAZ CLIC EN LOS NODOS (+) PARA VER ESPECIFICACIONES
                </span>
              </div>
            </div>

            {/* Panel Lateral de Telemetría del Nodo Seleccionado */}
            <div className="lg:col-span-4 bg-neutral-900/90 border border-neutral-800 p-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-sky-400 block font-bold">
                  ESPECIFICACIÓN TÉCNICA ACTIVA
                </span>

                {COURT_HOTSPOTS.map((spot) => {
                  const isSelected = activeHotspot === spot.id;
                  return (
                    <div
                      key={spot.id}
                      onClick={() => setActiveHotspot(spot.id)}
                      className={`p-4 border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-neutral-950 border-sky-400 shadow-[0_0_25px_rgba(14,165,233,0.18)]"
                          : "bg-neutral-950/40 border-neutral-800 hover:border-neutral-700 opacity-75"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-display text-sm font-extrabold uppercase text-white">
                          {spot.title}
                        </h4>
                        <span className="text-[10px] font-mono font-black bg-sky-500/15 text-sky-400 px-2 py-0.5 border border-sky-500/30">
                          {spot.metric}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        {spot.detail}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-neutral-800">
                <a
                  href="#reservas"
                  className="w-full bg-white hover:bg-sky-400 text-neutral-950 font-mono font-black text-xs uppercase tracking-[0.18em] py-3.5 px-4 flex items-center justify-center gap-2 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  Jugar Hoy en Estas Pistas
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 03: BANNER TEST & RENT */}
      <section
        id="palas-banner"
        className="py-28 border-b border-neutral-800 bg-neutral-950 bg-luxury-noise text-white relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative border border-neutral-800 h-[420px] sm:h-[490px] group overflow-hidden">
              <RevealImage
                src="/rental-gear-ai.jpg"
                alt="Alquiler de Paletas y Pelotas Oficiales"
                cursorText="TRY & BUY"
                parallaxOffset={25}
                className="w-full h-full"
              />
              <div className="absolute bottom-5 left-5 right-5 z-30 bg-neutral-950/90 backdrop-blur-md p-5 border border-white/15">
                <span className="text-sky-400 font-mono font-bold block uppercase text-[10px] tracking-widest mb-1">
                  PROGRAMA TRY & BUY OFICIAL
                </span>
                <span className="text-white font-bold text-xs sm:text-sm block">
                  Probá cualquier pala de carbono durante tu turno por $4.000
                  ARS. Si la comprás, te descontamos el alquiler.
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="inline-block border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-[10px] font-mono tracking-[0.22em] uppercase text-sky-400 font-bold">
                03 • PRO-SHOP & TEST CENTER
              </div>
              <SplitTextReveal
                text="ALQUILER DE PALETAS & PELOTAS EN RECEPCIÓN"
                className="text-3xl sm:text-5xl font-extrabold uppercase text-white leading-[1.03]"
              />
              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
                ¿Venís directo del trabajo o querés sentir el tacto de una pala
                de carbono 12K antes de invertir? En recepción disponemos de
                toda la línea oficial Power Padel con overgrip recién colocado y
                tubos presurizados sellados.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="border border-neutral-800 bg-neutral-900/90 p-5 hover:border-sky-500/50 transition-colors">
                  <span className="text-sky-400 text-xs font-mono font-bold block mb-1">
                    TEST DE PALETA PRO
                  </span>
                  <span className="text-3xl font-black font-mono text-white block">
                    $4.000{" "}
                    <span className="text-xs font-normal text-neutral-400">
                      ARS / turno
                    </span>
                  </span>
                  <p className="text-[11px] text-neutral-400 mt-2">
                    100% bonificado si decidís comprar la pala nueva en el
                    complejo.
                  </p>
                </div>
                <div className="border border-neutral-800 bg-neutral-900/90 p-5 hover:border-sky-500/50 transition-colors">
                  <span className="text-sky-400 text-xs font-mono font-bold block mb-1">
                    TUBO PRESURIZADO (X3)
                  </span>
                  <span className="text-3xl font-black font-mono text-white block">
                    $7.500{" "}
                    <span className="text-xs font-normal text-neutral-400">
                      ARS / tubo
                    </span>
                  </span>
                  <p className="text-[11px] text-neutral-400 mt-2">
                    Tubo sellado Power Padel Pro Tour homologado por la ITF.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Magnetic strength={0.15}>
                  <a
                    href="#tienda-alquiler"
                    data-cursor="CATÁLOGO"
                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-sky-400 text-neutral-950 font-mono font-black text-xs uppercase tracking-[0.15em] py-4 px-6 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Ver Fichas Técnicas de Palas
                  </a>
                </Magnetic>
                <a
                  href="#reservas"
                  className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white text-white font-mono font-bold text-xs uppercase tracking-[0.15em] py-4 px-6 transition-colors"
                >
                  Sumar Alquiler a mi Turno
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 04: CATÁLOGO INTERACTIVO CON TILT 3D Y RADAR TELEMETRY */}
      <section
        id="tienda-alquiler"
        className="py-28 border-b border-neutral-200 bg-white"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 border-b border-neutral-200 pb-8">
            <div>
              <div className="inline-flex items-center gap-2 border border-neutral-300 bg-neutral-50 px-3 py-1 text-[10px] font-mono tracking-[0.22em] uppercase text-neutral-800 font-bold mb-3">
                <SlidersHorizontal className="w-3 h-3 text-sky-600" />
                04 • PRO-SHOP OFICIAL POWER PADEL
              </div>
              <SplitTextReveal
                text="CATÁLOGO & TELEMETRÍA DE PALAS"
                className="text-3xl sm:text-5xl font-extrabold uppercase text-neutral-950 leading-[1.02]"
              />
              <p className="text-xs sm:text-sm text-neutral-500 mt-3 font-mono max-w-xl">
                Hacé clic en cualquier pala para abrir su{" "}
                <strong className="text-neutral-900">
                  Radar Poligonal de 5 Ejes (Potencia, Control, Rebote, Efecto
                  3D y Punto Dulce)
                </strong>
                .
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: "all", label: `Todos (${PRODUCTS.length})` },
                { key: "paletas", label: "Paletas Carbono" },
                { key: "pelotas", label: "Pelotas ITF" },
                { key: "rent", label: "Test en Pista ($4.000)" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStoreFilter(tab.key as typeof storeFilter)}
                  className={`text-xs font-mono font-bold uppercase tracking-wider py-2.5 px-4 transition-all cursor-pointer ${
                    storeFilter === tab.key
                      ? "bg-neutral-950 text-white shadow-sm"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {filteredProducts.map((product, idx) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <TiltCard
                  cursorText="RADAR 5-EJES"
                  maxTilt={5}
                  onClick={() => setActiveProductModal(product)}
                  className="h-full flex flex-col justify-between cursor-pointer border border-neutral-200 hover:border-neutral-950 bg-white transition-all duration-300 hover:shadow-[0_22px_50px_rgba(0,0,0,0.1)]"
                >
                  <div>
                    <div className="relative bg-neutral-50 p-6 flex items-center justify-center aspect-[4/5] overflow-hidden border-b border-neutral-100">
                      <div className="absolute top-3 left-3 z-10 bg-neutral-950 text-white text-[9px] font-mono uppercase px-2.5 py-1 tracking-wider font-bold">
                        {product.badge}
                      </div>
                      <span className="absolute top-3 right-3 z-10 text-[9px] font-mono text-neutral-400 uppercase">
                        {product.specs.weight}
                      </span>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain filter contrast-105 transition-transform duration-500 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-neutral-950/95 text-white py-2.5 px-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider">
                        <span>Abrir Telemetría</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-sky-400" />
                      </div>
                    </div>

                    <div className="p-4 space-y-2.5">
                      <div className="text-[10px] font-mono text-neutral-400 uppercase">
                        {product.specs.shape} • {product.specs.balance}
                      </div>
                      <h3 className="font-display text-sm font-extrabold text-neutral-900 group-hover:text-sky-600 transition-colors leading-snug">
                        {product.name}
                      </h3>

                      {/* Mini barras de rendimiento en tarjeta */}
                      <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[9px] text-neutral-500">
                        <div>
                          <div className="flex justify-between">
                            <span>POT</span>
                            <span className="font-bold text-neutral-900">
                              {product.specs.power}
                            </span>
                          </div>
                          <div className="h-1 bg-neutral-100 mt-0.5">
                            <div
                              className="h-full bg-neutral-900"
                              style={{ width: `${product.specs.power}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <span>CTL</span>
                            <span className="font-bold text-sky-600">
                              {product.specs.control}
                            </span>
                          </div>
                          <div className="h-1 bg-neutral-100 mt-0.5">
                            <div
                              className="h-full bg-sky-500"
                              style={{ width: `${product.specs.control}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-3 border-t border-neutral-100 flex flex-col gap-1 bg-neutral-50/50">
                    <span className="text-xs font-mono font-black text-neutral-900">
                      Venta: ${product.price.toLocaleString("es-AR")} ARS
                    </span>
                    {product.rentPrice && (
                      <span className="text-[11px] font-mono text-sky-600 font-bold">
                        Test en Cancha: $
                        {product.rentPrice.toLocaleString("es-AR")} ARS
                      </span>
                    )}
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN 05: EL COMPLEJO CON GALERÍA */}
      <section
        id="complejo"
        className="py-28 border-b border-neutral-200 bg-neutral-50"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono uppercase tracking-[0.22em] text-sky-600 font-bold block">
                05 • EXPERIENCIA POWER PADEL
              </span>
              <SplitTextReveal
                text="PÁDEL AL AIRE LIBRE, ESPACIO VERDE Y TERCER TIEMPO"
                className="text-3xl sm:text-5xl font-extrabold uppercase text-neutral-950 leading-[1.03]"
              />
              <p className="text-neutral-600 text-sm leading-relaxed">
                El complejo está diseñado para vivir el deporte de principio a
                fin: disputá tu partido en cualquiera de nuestras 3 pistas de
                cristal azul y quedate en el jardín disfrutando del tercer
                tiempo con bebidas frías y cafetería.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  "3 canchas contiguas con amplio retiro perimetral entre pistas",
                  "Mesas y living exterior en el área verde para el tercer tiempo",
                  "Bebidas frías, cafetería y recepción con atención permanente",
                  "Estacionamiento privado vigilado dentro del predio",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-xs font-bold text-neutral-800"
                  >
                    <div className="w-5 h-5 bg-neutral-950 text-sky-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="border border-neutral-200 h-56 group overflow-hidden">
                <RevealImage
                  src="/canchas-frontal.png"
                  alt="Cancha Frontal"
                  cursorText="CANCHA 1"
                  delay={0}
                  className="w-full h-full"
                />
              </div>
              <div className="border border-neutral-200 h-56 group overflow-hidden">
                <RevealImage
                  src="/canchas-atardecer.png"
                  alt="Cancha Atardecer"
                  cursorText="ATARDECER"
                  delay={0.15}
                  className="w-full h-full"
                />
              </div>
              <div className="col-span-2 relative border border-neutral-200 h-64 group overflow-hidden">
                <RevealImage
                  src="/canchas-aerea.png"
                  alt="Vista Aérea Complejo"
                  cursorText="VISTA AÉREA"
                  delay={0.25}
                  className="w-full h-full"
                />
                <div className="absolute bottom-3 left-3 z-30 bg-neutral-950/90 text-white text-[10px] font-mono uppercase px-3 py-1 tracking-widest">
                  VISTA AÉREA DEL PREDIO • 3 PISTAS OFICIALES
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 06: EVENTOS CORPORATIVOS & GLOBO 3D INTERACTIVO */}
      <section
        id="eventos"
        className="py-28 border-b border-neutral-800 bg-neutral-900 bg-luxury-noise text-white relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-neutral-800 pb-8">
            <div>
              <div className="inline-flex items-center gap-2 border border-white/20 bg-neutral-800 px-3 py-1 text-[10px] font-mono tracking-[0.22em] uppercase text-sky-400 font-bold mb-3">
                <Trophy className="w-3.5 h-3.5 text-sky-400" />
                06 • EXCLUSIVIDAD TOTAL • EMPRESAS & CELEBRACIONES
              </div>
              <SplitTextReveal
                text="ALQUILER DEL PREDIO PARA EVENTOS & TORNEOS"
                className="text-3xl sm:text-5xl font-extrabold uppercase text-white leading-[1.03]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Trophy,
                title: "Torneos Corporativos",
                desc: "Jornadas de integración y torneos entre empresas. Las 3 canchas en simultáneo con fixture digital, planilleros y entrega de premios.",
                bullets: [
                  "3 canchas exclusivas por 3 a 5 horas",
                  "Fixture digital y trofeos incluidos",
                  "Servicio de cafetería y bebidas frías",
                ],
                tag: "Ideal para 16 a 40 jugadores",
              },
              {
                icon: Flame,
                title: "Cumpleaños & Festejos",
                desc: "Festejá jugando al pádel con amigos. Partidos libres, uso del quincho asador, mesas en el jardín, heladeras y música ambiental.",
                bullets: [
                  "Uso libre de canchas y paletas para invitados",
                  "Quincho, parrillero y mesas en el jardín",
                  "Sonido ambiental y estacionamiento privado",
                ],
                tag: "Partidos + Asado con amigos",
              },
              {
                icon: Wine,
                title: "Clínicas & Jornadas VIP",
                desc: "Alquiler del predio por media jornada o día completo para entrenadores, exhibiciones de marcas o entrenamientos de alto rendimiento.",
                bullets: [
                  "Media jornada o jornada completa",
                  "Canastos de pelotas y palas de test",
                  "Acceso a zona técnica y vestuarios",
                ],
                tag: "Clínicas, masterclasses y marcas",
              },
            ].map((ev) => {
              const IconComp = ev.icon;
              return (
                <TiltCard
                  key={ev.title}
                  cursorText="EVENTO VIP"
                  maxTilt={4}
                  className="bg-neutral-950 border border-neutral-800 p-8 flex flex-col justify-between hover:border-sky-500/60 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-extrabold uppercase text-white tracking-tight group-hover:text-sky-400 transition-colors">
                        {ev.title}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                        {ev.desc}
                      </p>
                    </div>
                    <div className="space-y-2 pt-3 border-t border-neutral-800/80 text-xs text-neutral-300">
                      {ev.bullets.map((b) => (
                        <div key={b} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-6 mt-6 border-t border-neutral-800">
                    <span className="text-[11px] font-mono text-sky-400 block uppercase font-bold">
                      {ev.tag}
                    </span>
                  </div>
                </TiltCard>
              );
            })}
          </div>

          {/* Globo 3D + Configurador Interactivo */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-neutral-950 border border-neutral-800 p-6 sm:p-10">
            <div
              data-cursor="ARRASTRAR 3D"
              className="lg:col-span-6 flex flex-col items-center justify-center relative overflow-hidden"
            >
              <div className="text-center mb-4 z-10">
                <div className="inline-flex items-center gap-2 border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[10px] font-mono tracking-[0.2em] uppercase text-sky-300 rounded-full mb-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                  MENDOZA • ARGENTINA
                </div>
                <h4 className="font-display text-xl font-extrabold uppercase text-white">
                  Sede Oficial de Eventos Deportivos
                </h4>
              </div>
              <div className="w-full max-w-[360px] aspect-square flex items-center justify-center relative">
                <Globe />
              </div>
              <div className="text-center z-10 mt-2">
                <span className="text-[11px] font-mono text-neutral-400">
                  📍 GPS: -32.8941726, -68.6900863 • POWER PADEL
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6 lg:border-l lg:border-neutral-800 lg:pl-10">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-sky-400 block mb-1">
                  COTIZADOR INTERACTIVO
                </span>
                <h3 className="font-display text-2xl font-extrabold uppercase text-white tracking-tight">
                  Configura tu Evento Privado
                </h3>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 block">
                  1. Formato del Evento:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Torneo Corporativo",
                    "Cumpleaños & Asado",
                    "Clínica Deportiva",
                    "Jornada Amigos VIP",
                  ].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEventType(type)}
                      className={`text-xs font-mono font-bold py-3 px-3 uppercase tracking-wider transition-all text-left cursor-pointer ${
                        eventType === type
                          ? "bg-sky-500 text-neutral-950 font-black shadow-md"
                          : "bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-neutral-600"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 block">
                  2. Cantidad Estimada de Asistentes:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    "12 a 24 personas",
                    "25 a 40 personas",
                    "40+ invitados",
                  ].map((guests) => (
                    <button
                      key={guests}
                      type="button"
                      onClick={() => setEventGuests(guests)}
                      className={`text-[11px] font-mono font-bold py-3 px-2 uppercase tracking-wider transition-all text-center cursor-pointer ${
                        eventGuests === guests
                          ? "bg-white text-neutral-950 font-black"
                          : "bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-neutral-600"
                      }`}
                    >
                      {guests}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 space-y-3">
                <a
                  href={`https://wa.me/5491112345678?text=${encodeURIComponent(
                    `¡Hola Power Padel! Quisiera cotizar el alquiler exclusivo del predio para un evento de tipo: ${eventType}, para aproximadamente ${eventGuests}. ¿Qué fechas tienen disponibles?`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="WHATSAPP"
                  className="w-full block bg-sky-500 hover:bg-sky-400 text-neutral-950 font-black text-xs uppercase tracking-[0.2em] py-4 text-center transition-all shadow-lg font-mono"
                >
                  Solicitar Presupuesto por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 07: UBICACIÓN & GOOGLE MAPS */}
      <section
        id="ubicacion"
        className="py-28 border-b border-neutral-800 bg-neutral-950 text-white"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-neutral-800 pb-8">
            <div>
              <div className="inline-flex items-center gap-2 border border-white/20 bg-neutral-900 px-3 py-1 text-[10px] font-mono tracking-[0.2em] uppercase text-sky-400 font-bold mb-3">
                <MapPin className="w-3 h-3 text-sky-400" />
                07 • PUNTO DE ENCUENTRO OFICIAL
              </div>
              <SplitTextReveal
                text="UBICACIÓN & CÓMO LLEGAR"
                className="text-3xl sm:text-5xl font-extrabold uppercase text-white leading-[1.03]"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://www.google.com/maps/place/POWER+PADEL/@-32.8941726,-68.6900863,17z"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-neutral-950 font-black text-xs uppercase tracking-[0.15em] py-3.5 px-6 transition-colors font-mono"
              >
                <ExternalLink className="w-4 h-4" />
                Abrir en Google Maps
              </a>
              <a
                href="https://waze.com/ul?ll=-32.8941726,-68.6900863&navigate=yes"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-white/30 hover:border-white bg-white/5 text-white font-bold text-xs uppercase tracking-[0.15em] py-3.5 px-5 transition-colors font-mono"
              >
                <Navigation className="w-4 h-4 text-sky-400" />
                Navegar con Waze
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-neutral-900/90 border border-neutral-800 p-8">
              <div className="space-y-6">
                <div className="border-b border-neutral-800 pb-5">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-sky-400 block mb-1">
                    SEDE MENDOZA
                  </span>
                  <h3 className="font-display text-2xl font-extrabold uppercase text-white tracking-tight">
                    POWER PADEL CLUB
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono mt-1">
                    GPS: -32.8941726, -68.6900863
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-neutral-800 border border-neutral-700 shrink-0">
                      <Clock className="w-4 h-4 text-sky-400" />
                    </div>
                    <div>
                      <span className="text-white font-bold block uppercase tracking-wider text-[11px]">
                        Horarios del Complejo
                      </span>
                      <p className="text-neutral-400 mt-0.5 font-mono">
                        Lunes a Domingo de 08:00 a 23:30 hs.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-neutral-800 border border-neutral-700 shrink-0">
                      <Shield className="w-4 h-4 text-sky-400" />
                    </div>
                    <div>
                      <span className="text-white font-bold block uppercase tracking-wider text-[11px]">
                        Estacionamiento Privado
                      </span>
                      <p className="text-neutral-400 mt-0.5 font-mono">
                        Predio cerrado con estacionamiento interno gratuito.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="#reservas"
                className="w-full block bg-sky-500 hover:bg-sky-400 text-neutral-950 font-black text-xs uppercase tracking-[0.2em] py-4 text-center transition-colors font-mono"
              >
                Reservar Cancha en Este Complejo
              </a>
            </div>

            <div className="lg:col-span-7 relative min-h-[420px] border border-neutral-800 overflow-hidden bg-neutral-900">
              <iframe
                title="Ubicación POWER PADEL en Google Maps"
                src="https://maps.google.com/maps?q=-32.8941726,-68.6900863&hl=es&z=16&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "440px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter contrast-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PREGUNTAS FRECUENTES */}
      <section id="faq" className="py-28 border-b border-neutral-200 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-[0.22em] text-sky-600 font-bold block mb-2">
              08 • CENTRO DE AYUDA
            </span>
            <SplitTextReveal
              text="PREGUNTAS FRECUENTES"
              className="text-3xl sm:text-5xl font-extrabold uppercase text-neutral-950"
            />
          </div>

          <div className="border-t border-neutral-200 divide-y divide-neutral-200">
            {FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.q} className="py-5">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left flex justify-between items-center text-sm font-black uppercase tracking-wider text-neutral-900 hover:text-sky-600 transition-colors cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 ml-4 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-sky-600" : "text-neutral-400"
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="pt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed pr-8">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-neutral-950 text-neutral-400 py-16 text-xs border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-800">
            <div className="space-y-4">
              <img
                src="/logo.png"
                alt="Logo Power Padel"
                className="h-8 w-auto object-contain filter invert brightness-200"
              />
              <p className="text-[11px] leading-relaxed text-neutral-400">
                Complejo oficial de 3 canchas panorámicas con césped azul
                profesional. Alquiler de pistas, tienda pro-shop y programa Test
                & Rent.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-display text-white font-bold uppercase tracking-wider text-xs">
                Horarios del Complejo
              </h4>
              <p className="text-[11px] leading-relaxed font-mono">
                Lunes a Domingo: 08:00 a 23:30 hs
                <br />
                Iluminación LED nocturna 800 lux
                <br />
                Recepción y cafetería continuas
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-display text-white font-bold uppercase tracking-wider text-xs">
                Tarifas Oficiales ($ ARS)
              </h4>
              <p className="text-[11px] leading-relaxed font-mono">
                Turno 60 minutos: $16.000 ARS
                <br />
                Turno 90 minutos: $22.000 ARS
                <br />
                Alquiler de Paleta: $4.000 ARS / turno
                <br />
                Tubo de Pelotas Pro: $7.500 ARS
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-display text-white font-bold uppercase tracking-wider text-xs">
                Ubicación & Contacto
              </h4>
              <p className="text-[11px] leading-relaxed font-mono">
                POWER PADEL • Mendoza, Argentina
                <br />
                GPS: -32.8941726, -68.6900863
              </p>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 font-mono">
            <p>© 2026 POWER PADEL CLUB. Todos los derechos reservados.</p>
            <p className="mt-2 sm:mt-0 text-neutral-600">
              INGENIERÍA FRONTEND & TELEMETRÍA INTERACTIVA
            </p>
          </div>
        </div>
      </footer>

      {/* MODAL TÉCNICO DE PRODUCTO CON RADAR SVG DE 5 EJES */}
      <AnimatePresence>
        {activeProductModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveProductModal(null)}
            className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-neutral-200 max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 overflow-hidden shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setActiveProductModal(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 bg-neutral-950 text-white flex items-center justify-center hover:bg-sky-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="md:col-span-5 bg-neutral-100 p-8 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-neutral-200">
                <img
                  src={activeProductModal.image}
                  alt={activeProductModal.name}
                  className="max-h-64 object-contain my-auto"
                />
                <div className="pt-4 w-full border-t border-neutral-200/80">
                  <RadarTelemetry
                    power={activeProductModal.specs.power}
                    control={activeProductModal.specs.control}
                    rebound={activeProductModal.specs.rebound}
                    spin={activeProductModal.specs.spin}
                    sweetspot={activeProductModal.specs.sweetspot}
                  />
                </div>
              </div>

              <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] bg-neutral-950 text-sky-400 px-2.5 py-1 font-bold">
                        {activeProductModal.badge}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider bg-neutral-100 text-neutral-700 px-2.5 py-1 font-bold">
                        PESO: {activeProductModal.specs.weight}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-extrabold uppercase text-neutral-950 mt-2.5">
                      {activeProductModal.name}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                      {activeProductModal.specs.description}
                    </p>
                  </div>

                  {/* Ficha de Materiales */}
                  <div className="grid grid-cols-2 gap-2.5 bg-neutral-50 p-3.5 border border-neutral-200 text-[11px] font-mono">
                    <div>
                      <span className="text-neutral-400 block text-[9px] uppercase">
                        Molde & Balance
                      </span>
                      <span className="font-bold text-neutral-900">
                        {activeProductModal.specs.shape}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[9px] uppercase">
                        Núcleo Interno
                      </span>
                      <span className="font-bold text-neutral-900">
                        {activeProductModal.specs.core}
                      </span>
                    </div>
                    <div className="col-span-2 pt-1.5 border-t border-neutral-200/70">
                      <span className="text-neutral-400 block text-[9px] uppercase">
                        Plano Exterior
                      </span>
                      <span className="font-bold text-neutral-900">
                        {activeProductModal.specs.surface}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-1 font-mono text-[11px]">
                    {[
                      { label: "POTENCIA", val: activeProductModal.specs.power },
                      {
                        label: "CONTROL",
                        val: activeProductModal.specs.control,
                      },
                      {
                        label: "SALIDA DE BOLA",
                        val: activeProductModal.specs.rebound,
                      },
                      {
                        label: "EFECTO RUGOSO 3D",
                        val: activeProductModal.specs.spin,
                      },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <div className="flex justify-between font-bold mb-1">
                          <span>{stat.label}</span>
                          <span className="text-sky-600">{stat.val}/100</span>
                        </div>
                        <div className="h-1.5 w-full bg-neutral-200 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.val}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="h-full bg-neutral-950"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => addToCart(activeProductModal, "buy")}
                    className="flex-1 bg-neutral-950 hover:bg-sky-600 text-white font-mono font-black text-xs uppercase tracking-wider py-3.5 px-4 transition-colors cursor-pointer"
                  >
                    Comprar Nueva ($
                    {activeProductModal.price.toLocaleString("es-AR")})
                  </button>
                  {activeProductModal.rentPrice && (
                    <button
                      type="button"
                      onClick={() => addToCart(activeProductModal, "rent")}
                      className="flex-1 border border-neutral-950 hover:bg-neutral-100 text-neutral-950 font-mono font-bold text-xs uppercase tracking-wider py-3.5 px-4 transition-colors cursor-pointer"
                    >
                      Test en Cancha ($
                      {activeProductModal.rentPrice.toLocaleString("es-AR")})
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DRAWER LATERAL DE BOLSA DE COMPRAS */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-xs flex justify-end"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-neutral-950 text-white h-full p-6 sm:p-8 flex flex-col justify-between border-l border-neutral-800"
            >
              <div>
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-sky-400 block">
                      PRO-SHOP & TEST CENTER
                    </span>
                    <h3 className="font-display text-lg font-extrabold uppercase">
                      Tu Bolsa Power Padel
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="py-20 text-center space-y-3">
                    <ShoppingBag className="w-10 h-10 text-neutral-700 mx-auto" />
                    <p className="text-xs font-mono text-neutral-400">
                      Todavía no agregaste palas ni pelotas a tu bolsa.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-800 mt-4 max-h-[60vh] overflow-y-auto pr-1">
                    {cart.map((item) => {
                      const unit =
                        item.mode === "rent"
                          ? item.product.rentPrice || item.product.price
                          : item.product.price;
                      return (
                        <div
                          key={`${item.product.id}-${item.mode}`}
                          className="py-4 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-12 h-14 object-contain bg-white p-1"
                            />
                            <div>
                              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-sky-500/20 text-sky-300 font-bold">
                                {item.mode === "rent"
                                  ? "ALQUILER TEST"
                                  : "COMPRA NUEVA"}
                              </span>
                              <h4 className="text-xs font-bold text-white mt-1">
                                {item.product.name}
                              </h4>
                              <span className="text-[11px] font-mono text-neutral-400">
                                {item.qty} x ${unit.toLocaleString("es-AR")} ARS
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(item.product.id, item.mode)
                            }
                            className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-neutral-800 pt-5 space-y-4">
                  <div className="flex justify-between items-baseline font-mono">
                    <span className="text-xs text-neutral-400 uppercase">
                      Total Estimado:
                    </span>
                    <span className="text-2xl font-black text-white">
                      ${cartTotal.toLocaleString("es-AR")} ARS
                    </span>
                  </div>
                  <a
                    href={`https://wa.me/5491112345678?text=${encodeURIComponent(
                      `¡Hola Power Padel! Quiero encargar en recepción:\n${cart
                        .map(
                          (i) =>
                            `• ${i.qty}x ${i.product.name} (${
                              i.mode === "rent"
                                ? "Alquiler Test"
                                : "Compra Directa"
                            })`
                        )
                        .join("\n")}\nTotal: $${cartTotal.toLocaleString("es-AR")} ARS`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full block bg-sky-500 hover:bg-sky-400 text-neutral-950 font-mono font-black text-xs uppercase tracking-[0.18em] py-4 text-center transition-colors"
                  >
                    Reservar Pedido en Recepción
                  </a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
