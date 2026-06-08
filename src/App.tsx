import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Download, 
  Compass, 
  FileText, 
  Check, 
  Copy,
  ExternalLink, 
  Menu, 
  X, 
  Search,
  Calendar,
  Wallet,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  Award,
  Trees,
  Waves,
  Car,
  Home,
  ArrowRight,
  PhoneCall,
  Printer,
  ChevronLeft
} from "lucide-react";
import FloorPlan from "./components/FloorPlan";
import { 
  PROPERTY_PARAMETERS, 
  GALLERY_ITEMS, 
  downloadBrochure 
} from "./data";
import { PropertyParameter, GalleryItem } from "./types";

export default function App() {
  // Navigation states
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Gallery filter & Lightbox states
  const [galleryFilter, setGalleryFilter] = useState<"all" | "exterior" | "interior">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isTextExpanded, setIsTextExpanded] = useState(false);

  // Parameter search & category filter states
  const [paramSearch, setParamSearch] = useState("");
  const [paramCategory, setParamCategory] = useState<string>("all");
  const [isParamsExpanded, setIsParamsExpanded] = useState(false);

  // Clipboard copy state
  const [phoneCopied, setPhoneCopied] = useState(false);
  const copyPhoneNumber = () => {
    navigator.clipboard.writeText("724 562 682");
    setPhoneCopied(true);
    setTimeout(() => setPhoneCopied(false), 2000);
  };

  // Booking Form Submission State
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    message: "",
    deliveryCatalog: true
  });

  // Track scrolling to update sticky state & highlight sections
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);

      // Section highlighters
      const sections = ["hero", "overview", "parameters", "floorplans", "location", "contact"];
      const currentScroll = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (currentScroll >= top && currentScroll < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize Leaflet map
  useEffect(() => {
    if (typeof window === "undefined") return;

    let mapInstance: any = null;
    let timeoutId: any = null;

    const initMap = () => {
      const L = (window as any).L;
      if (!L) {
        timeoutId = setTimeout(initMap, 200);
        return;
      }

      const mapContainer = document.getElementById("leaflet-map");
      if (!mapContainer) {
        timeoutId = setTimeout(initMap, 200);
        return;
      }

      // Clear any previous Leaflet instances in container just in case
      mapContainer.innerHTML = "";

      // Center around Dlouhá 210, Předboj
      const centerCoords: [number, number] = [50.2288323, 14.4789659];
      
      mapInstance = L.map("leaflet-map", {
        center: centerCoords,
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapInstance);

      // Category colors mapping for map pins (Každá kategorie má jinou barvu pinu)
      const categoryColors: Record<string, string> = {
        home: "#C16B5C",       // Warm terracotta (primary focus)
        shopping: "#EAB308",   // Warm amber/gold for shopping
        education: "#22C55E",  // Vibrant green for schools
        health: "#06B6D4",     // Cyan for pharmacies / clinics
        restaurant: "#F43F5E", // Rose/red for restaurants / bistros
        sport: "#8B5CF6",      // Purple/Indigo for sport, nature, and leisure
        transport: "#64748B"   // Slate gray for transit/services
      };

      // Custom div wrapper with category-specific or active terracotta accent styling
      const createCustomIcon = (emoji: string, isActive: boolean, category?: string) => {
        const pinBgColor = isActive ? "#C16B5C" : (category ? categoryColors[category] || "#111111" : "#111111");
        return L.divIcon({
          className: "custom-leaflet-pin",
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px;">
              ${isActive ? `
                <div style="position: absolute; width: 44px; height: 44px; background-color: rgba(193, 107, 92, 0.4); border-radius: 9999px; transform: scale(1); animation: pin-pulse 2s infinite ease-in-out; pointer-events: none; top: -2px; left: -2px;"></div>
              ` : ''}
              <div style="width: 40px; height: 40px; border-radius: 9999px; background-color: ${pinBgColor}; border: ${isActive ? '2px solid #FFFFFF' : '1px solid rgba(255,255,255,0.4)'}; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5); transform: scale(1); transition: transform 0.2s ease-in-out; z-index: 10;">
                <span>${emoji}</span>
              </div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
          popupAnchor: [0, -20]
        });
      };

      const locations = [
        {
          coords: [50.2288323, 14.4789659],
          emoji: "🏡",
          isActive: true,
          title: "Rezidence Předboj (Dlouhá 210)",
          desc: "Luxusní rodinný dům 6+kk s vyhřívaným bazénem, garáží a velkolepým soukromím.",
          category: "home"
        },
        {
          coords: [50.2263, 14.4779],
          emoji: "🛒",
          isActive: false,
          title: "Potraviny Předboj",
          desc: "Místní potraviny, otevřeno denně",
          category: "shopping"
        },
        {
          coords: [50.1758, 14.6705],
          emoji: "🛒",
          isActive: false,
          title: "Tesco Zápy",
          desc: "Hypermarket, 15 min autem",
          category: "shopping"
        },
        {
          coords: [50.2375, 14.4984],
          emoji: "🥩",
          isActive: false,
          title: "Uzeniny Beta (řeznictví, 4.7★)",
          desc: "Kvalitní řeznictví a uzenářství",
          category: "shopping"
        },
        {
          coords: [50.2266, 14.4777],
          emoji: "🏫",
          isActive: false,
          title: "Mateřská škola Předboj",
          desc: "MŠ přímo v obci",
          category: "education"
        },
        {
          coords: [50.1957, 14.5021],
          emoji: "🏫",
          isActive: false,
          title: "ZŠ a ZUŠ Líbeznice",
          desc: "Základní škola, 5 min autem",
          category: "education"
        },
        {
          coords: [50.1918, 14.4974],
          emoji: "🏥",
          isActive: false,
          title: "JH Medica Líbeznice",
          desc: "Praktický lékař, hodnocení 4.7★",
          category: "health"
        },
        {
          coords: [50.1926, 14.4952],
          emoji: "💊",
          isActive: false,
          title: "Lékárna Líbeznice",
          desc: "Lékárna v centru Líbeznic",
          category: "health"
        },
        {
          coords: [50.2230, 14.4758],
          emoji: "🍽️",
          isActive: false,
          title: "Yard Resort",
          desc: "Restaurace a hotel, golf, 4.7★, 861 hodnocení",
          category: "restaurant"
        },
        {
          coords: [50.1944, 14.4925],
          emoji: "☕",
          isActive: false,
          title: "Bistro Statek Líbeznice",
          desc: "Oblíbené snídaňové bistro, 4.7★",
          category: "restaurant"
        },
        {
          coords: [50.2298, 14.4827],
          emoji: "⚽",
          isActive: false,
          title: "FC Sokol Předboj",
          desc: "Fotbalové hřiště a sportovní areál",
          category: "sport"
        },
        {
          coords: [50.2257, 14.4710],
          emoji: "🛝",
          isActive: false,
          title: "Dětské hřiště Předboj",
          desc: "Prostorné hřiště s lanovými prvky",
          category: "sport"
        },
        {
          coords: [50.2237, 14.4701],
          emoji: "🌳",
          isActive: false,
          title: "Předbojský rybník",
          desc: "Procházky, příroda a odpočinek",
          category: "sport"
        },
        {
          coords: [50.2268, 14.4765],
          emoji: "💪",
          isActive: false,
          title: "Bodypub fitness studio",
          desc: "Místní fitness a posilovna",
          category: "sport"
        },
        {
          coords: [50.2260, 14.4782],
          emoji: "🚌",
          isActive: false,
          title: "Zastávka Předboj",
          desc: "Autobusová zastávka v obci",
          category: "transport"
        },
        {
          coords: [50.1944, 14.4934],
          emoji: "✉️",
          isActive: false,
          title: "Česká pošta",
          desc: "Pobočka pošty v sousedních Líbeznicích",
          category: "transport"
        }
      ];

      locations.forEach(loc => {
        const marker = L.marker(loc.coords, {
          icon: createCustomIcon(loc.emoji, loc.isActive, loc.category)
        }).addTo(mapInstance);

        const popupContent = `
          <div style="padding: 12px; max-width: 240px; text-align: left; font-family: sans-serif;">
            <h4 style="font-family: serif; font-weight: bold; font-size: 14px; color: #C16B5C; margin: 0 0 6px 0;">${loc.title}</h4>
            <p style="font-size: 12px; color: rgba(255,255,255,0.8); line-height: 1.5; margin: 0;">${loc.desc}</p>
          </div>
        `;

        marker.bindPopup(popupContent, {
          offset: L.point(0, -6)
        });
        if (loc.isActive) {
          marker.openPopup();
        }
      });
    };

    const handleLoad = () => {
      timeoutId = setTimeout(initMap, 300);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
      clearTimeout(timeoutId);
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  const handleScrollTo = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const topOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Filter parameters lists
  const filteredParameters = PROPERTY_PARAMETERS.filter(param => {
    const matchesSearch = param.label.toLowerCase().includes(paramSearch.toLowerCase()) || 
                          param.value.toLowerCase().includes(paramSearch.toLowerCase());
    const matchesCat = paramCategory === "all" || param.category === paramCategory;
    return matchesSearch && matchesCat;
  });

  const displayedParameters = (paramCategory === "all" && !isParamsExpanded)
    ? filteredParameters.slice(0, 9)
    : filteredParameters;

  // Unique parameter categories (for rendering tabs)
  const categoriesList = [
    { key: "all", label: "Všechny" },
    { key: "základní", label: "Základní" },
    { key: "výměry", label: "Rozměry" },
    { key: "technické", label: "Technické" },
    { key: "vybavení", label: "Vybavení" },
    { key: "lokalita", label: "Lokalita" }
  ];

  // Map gallery items matching visual expectations
  const filteredGallery = galleryFilter === "all" 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === galleryFilter);

  const displayedPhotos = filteredGallery;

  // Form handle change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API delivery
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen text-white bg-[#050505] font-sans selection:bg-[#C16B5C] selection:text-white">
      
      {/* Dynamic Background Noise Decorator */}
      <div className="fixed inset-0 pointer-events-none z-[1] bg-noise opacity-5" />

      {/* 
        NAVBAR HEADER: Fully responsive immersive black layout with terracotta highlights
      */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 no-print ${
        scrolled 
          ? "bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10 shadow-2xl py-3" 
          : "bg-transparent py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo Brand */}
          <button 
            onClick={() => handleScrollTo("hero")} 
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-[#111111] border border-[#C16B5C]/40 flex items-center justify-center shadow-lg group-hover:border-[#C16B5C] transition-all duration-300">
              <span className="font-serif font-bold text-sm text-[#C16B5C]">RP</span>
            </div>
            <div>
              <span className="block text-[10px] font-mono tracking-[0.2em] text-[#C16B5C] uppercase font-bold">Rezidence</span>
              <span className="block text-lg font-serif font-bold tracking-wider text-white group-hover:text-[#C16B5C] transition-all">PŘEDBOJ</span>
            </div>
          </button>

          {/* Desktop Nav tabs */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-[#0a0a0a]/80 border border-white/10 rounded-full">
            <button 
              onClick={() => handleScrollTo("hero")}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                activeSection === "hero" 
                  ? "bg-[#C16B5C] text-white shadow-[0_4px_12px_rgba(193,107,92,0.25)] hover:shadow-[0_4px_20px_rgba(193,107,92,0.45)]" 
                  : "text-white/60 hover:text-[#C16B5C]"
              }`}
            >
              Úvod
            </button>
            <button 
              onClick={() => handleScrollTo("overview")}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                activeSection === "overview" 
                  ? "bg-[#C16B5C] text-white shadow-[0_4px_12px_rgba(193,107,92,0.25)] hover:shadow-[0_4px_20px_rgba(193,107,92,0.45)]" 
                  : "text-white/60 hover:text-[#C16B5C]"
              }`}
            >
              O domě
            </button>
            <button 
              onClick={() => handleScrollTo("parameters")}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                activeSection === "parameters" 
                  ? "bg-[#C16B5C] text-white shadow-[0_4px_12px_rgba(193,107,92,0.25)] hover:shadow-[0_4px_20px_rgba(193,107,92,0.45)]" 
                  : "text-white/60 hover:text-[#C16B5C]"
              }`}
            >
              Parametry
            </button>
            <button 
              onClick={() => handleScrollTo("floorplans")}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                activeSection === "floorplans" 
                  ? "bg-[#C16B5C] text-white shadow-[0_4px_12px_rgba(193,107,92,0.25)] hover:shadow-[0_4px_20px_rgba(193,107,92,0.45)]" 
                  : "text-white/60 hover:text-[#C16B5C]"
              }`}
            >
              Půdorysy
            </button>
            <button 
              onClick={() => handleScrollTo("location")}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                activeSection === "location" 
                  ? "bg-[#C16B5C] text-white shadow-[0_4px_12px_rgba(193,107,92,0.25)] hover:shadow-[0_4px_20px_rgba(193,107,92,0.45)]" 
                  : "text-white/60 hover:text-[#C16B5C]"
              }`}
            >
              Lokalita
            </button>
            <button 
              onClick={() => handleScrollTo("contact")}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                activeSection === "contact" 
                  ? "bg-[#C16B5C] text-white shadow-[0_4px_12px_rgba(193,107,92,0.25)] hover:shadow-[0_4px_20px_rgba(193,107,92,0.45)]" 
                  : "text-white/60 hover:text-[#C16B5C]"
              }`}
            >
              Kontakt
            </button>
          </nav>

          {/* Uniform Action Row containing CTA and Burger Toggle for extreme cleanly look */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                handleScrollTo("contact");
                setMobileMenuOpen(false);
              }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#C16B5C] text-white font-sans text-[10px] sm:text-xs font-extrabold uppercase tracking-widest rounded-full hover:bg-[#B05B4D] hover:-translate-y-0.5 transition-all shadow-[0_4px_14px_rgba(193,107,92,0.25)] hover:shadow-[0_4px_25px_rgba(193,107,92,0.45)] active:translate-y-0 cursor-pointer"
              id="header-cta"
            >
              <Calendar className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline-block">Sjednat prohlídku</span>
              <span className="sm:hidden">Prohlídka</span>
            </button>

            {/* Toggle for mobile menu */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-[#111111] border border-white/10 rounded-full text-[#C16B5C] lg:hidden cursor-pointer hover:bg-white/5 hover:text-white transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* 
        MOBILE NAVIGATION MENU OVERLAY 
      */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[70px] z-40 bg-[#0a0a0a]/95 border-b border-white/10 backdrop-blur-lg p-5 flex flex-col gap-4 shadow-2xl lg:hidden no-print"
          >
            <div className="flex flex-col gap-1">
              {[
                { id: "hero", label: "Úvodní představení" },
                { id: "overview", label: "O rodinném domě" },
                { id: "parameters", label: "Podrobné parametry" },
                { id: "floorplans", label: "Interaktivní půdorysy" },
                { id: "location", label: "Lokalita a mapa" },
                { id: "contact", label: "Rezervace / Kontakt" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    handleScrollTo(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeSection === item.id 
                      ? "bg-[#C16B5C] text-white font-semibold shadow-[0_4px_12px_rgba(193,107,92,0.2)]" 
                      : "text-white/70 hover:bg-[#111111] hover:text-[#C16B5C]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>


          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        1. MAIN HERO SECTION 
      */}
      <section 
        id="hero" 
        className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden border-b border-white/10"
      >
        {/* Immersive cinematic background of the residence */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/d/1GT2v8-40CbFxTlJ2qVhoP-UEx2zp8iBm" 
            alt="Rezidence Předboj" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-[1500ms]" 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://picsum.photos/seed/villaext/1920/1080";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/65 to-[#050505]/75" />
        </div>

        {/* Subtle glowing dark-gold ambient accent */}
        <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#C16B5C]/10 rounded-full blur-[140px] pointer-events-none z-[1]" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center py-20 lg:py-32 flex flex-col items-center justify-center space-y-8">
          
          <div className="space-y-4">
            <div className="inline-block border border-[#C16B5C]/30 bg-black/60 px-4 py-1.5 text-[10px] font-bold tracking-[3px] uppercase rounded-full text-[#C16B5C] shadow-lg">
              VÝHRADNÍ PRODEJ
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white leading-tight drop-shadow-2xl">
              REZIDENCE PŘEDBOJ
            </h1>
            
            <p className="text-sm sm:text-base lg:text-lg text-white/80 max-w-xl mx-auto font-sans font-light tracking-wide">
              Exkluzivní a tiché rodinné zázemí s bazénem pouhých 20 minut od Prahy.
            </p>
          </div>

          <div className="w-16 h-[1px] bg-[#C16B5C]/55" />

          {/* Clean key parameters line */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-mono tracking-wider text-white">
            <div className="flex items-center gap-1.5">
              <span className="text-white/40">Užitná plocha:</span>
              <span className="font-bold">159 m²</span>
            </div>
            <span className="text-white/20 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-white/40">Pozemek:</span>
              <span className="font-bold">792 m²</span>
            </div>
            <span className="text-white/20 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-white/40">Cena:</span>
              <span className="font-bold text-[#C16B5C]">16 295 000 Kč</span>
            </div>
          </div>

          {/* Simple premium call to actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto pt-4 font-sans">
            <button
              onClick={() => handleScrollTo("floorplans")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C16B5C] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#B05B4D] hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(193,107,92,0.3)] hover:shadow-[0_4px_28px_rgba(193,107,92,0.5)] transition-all active:translate-y-0 cursor-pointer"
            >
              Prozkoumat vilu
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => handleScrollTo("contact")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white/5 hover:border-[#C16B5C]/50 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(193,107,92,0.15)] transition-all active:translate-y-0 cursor-pointer"
            >
              Rezervovat prohlídku
            </button>
          </div>

          {/* Small animated scroll indicator */}
          <div 
            onClick={() => handleScrollTo("overview")}
            className="pt-10 cursor-pointer group flex flex-col items-center gap-2 text-white/30 hover:text-[#C16B5C] transition-colors"
          >
            <span className="text-[9px] font-mono uppercase tracking-[3px]">Pokračovat dolů</span>
            <motion.div 
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              className="w-6 h-10 border border-white/20 group-hover:border-[#C16B5C] rounded-full flex justify-center p-1 transition-colors"
            >
              <div className="w-1.5 h-1.5 bg-[#C16B5C] rounded-full" />
            </motion.div>
          </div>

        </div>
      </section>

      {/* 
        2. DŮKLADNÝ POPIS NEMOVITOSTI (Overview with real-time Gallery filter)
      */}
      <section id="overview" className="py-20 lg:py-28 bg-[#111111] relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <div className="inline-block border border-[#C16B5C]/30 bg-[#C16B5C]/10 px-3 py-1 text-[10px] font-mono text-[#C16B5C] tracking-widest uppercase rounded-full">
              Charakteristika nemovitosti
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white">
              Váš budoucí vysněný domov
            </h2>
            <div className="w-20 h-[1px] bg-[#C16B5C] mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Text descriptions */}
            <div className="lg:col-span-6 space-y-6 text-white/90 text-sm sm:text-base leading-relaxed font-sans">
              
              <p className="font-semibold text-lg text-[#C16B5C] font-serif tracking-wide">
                Exkluzivně nabízíme k prodeji hezký, samostatně stojící dvoupodlažní rodinný dům zkolaudovaný v roce 2006, nacházející se v malebné a klidné obci Předboj, Praha-východ.
              </p>

              <div className="space-y-4 font-sans text-white/70 text-sm">
                <p>
                  Dům disponuje zastavěnou plochou <strong className="text-white">114 m²</strong> a velmi dobře řešenou užitnou plochou <strong className="text-white">159 m²</strong>. Celý objekt leží na rozlehlém pozemku o výměře <strong className="text-white">792 m²</strong>. Kolem domu se rozprostírá pečlivě udržovaná zahrada s čistou travnatou plochou <strong className="text-white">678 m²</strong> orientovanou na slunný jih.
                </p>
                <p>
                  Součástí zahrady je zahradní sluneční oáza tvořená zapuštěným rodinným bazénem o rozměrech <strong className="text-white">3 &times; 7 m se solárním ohřevem</strong> a menší zděný zahradní domek o velikosti <strong className="text-white">11 m²</strong>, který lze skvěle využít jako kutilskou dílnu, sklad pro zahradní nábytek, bazénovou technologii nebo kola.
                </p>

                {/* Collapsible section for smooth expander */}
                <div className="relative overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ height: isTextExpanded ? "auto" : 0, opacity: isTextExpanded ? 1 : 0 }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="space-y-4"
                  >
                    <p>
                      <strong>V přízemí domu (1.NP)</strong> se mimo prostornou garáž s dálkovým otevíráním nachází zádveří, spojovací chodba s koupelnou a WC, samostatný dětský nebo hostinský pokoj (ideální jako tichá pracovna) a především <strong>majestátní obývací hala spojená s jídelnou a plně zařízenou moderní kuchyní o celkové výměře 40,63 m²</strong>. Tato hala je vybavena designovým krbem s rozvody horkého vzduchu do všech ostatních pokojů a francouzskými dveřmi, které plynule propojují interiér se zastřešenou venkovní dřevěnou terasou (15 m²) s posezením.
                    </p>
                    <p>
                      <strong>V podkrovním patře (2.NP)</strong> jsou situovány čtyři samostatné neprůchozí pokoje a velká koupelna s luxusní rohovou vanou a druhou toaletou. Vytápění domu je vyřešeno ústředním elektrickým elektrokotlem v kombinaci s distribucí tepla z krbu. Dům je napojen na obecní vodovodní řad i vlastní studnu s pitnou vodou a na veřejnou splaškovou kanalizaci.
                    </p>
                  </motion.div>
                  
                  {!isTextExpanded && (
                    <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-[#111111] to-transparent pointer-events-none" />
                  )}
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => setIsTextExpanded(!isTextExpanded)}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#C16B5C] hover:text-[#B05B4D] transition-colors cursor-pointer"
                  id="toggle-description-btn"
                >
                  {isTextExpanded ? "Číst méně ↑" : "Číst více ↓"}
                </button>
              </div>

              {/* Unique layout badges */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="flex items-start gap-2 text-xs">
                  <Check className="w-4.5 h-4.5 text-[#C16B5C] shrink-0 mt-0.5" />
                  <span><strong>Skvělá lokalita</strong> - Klidná rezidenční část pouze 20 minut od okraje Prahy (Letňany).</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <Check className="w-4.5 h-4.5 text-[#C16B5C] shrink-0 mt-0.5" />
                  <span><strong>Bazén s ohřevem</strong> - Solární panely pro prodloužení léta bez nákladů na energii.</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <Check className="w-4.5 h-4.5 text-[#C16B5C] shrink-0 mt-0.5" />
                  <span><strong>Pokojů k životu: 6</strong> - Ideální pro velkou rodinu nebo kombinaci rodinného života s podnikáním.</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <Check className="w-4.5 h-4.5 text-[#C16B5C] shrink-0 mt-0.5" />
                  <span><strong>Krb s rozvody</strong> - Efektivní a tiché vytápění rodinnou atmosférou.</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Photo Gallery with Filters */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono uppercase text-[#C16B5C] tracking-wider font-bold">Fotogalerie rezidence</span>
                
                {/* Gallery Buttons filters */}
                <div className="flex gap-2">
                  {[
                    { key: "all", label: "Vše" },
                    { key: "exterior", label: "Zahrada / Venek" },
                    { key: "interior", label: "Interiér" }
                  ].map(btn => (
                    <button
                      key={btn.key}
                      onClick={() => setGalleryFilter(btn.key as any)}
                      className={`px-3 py-1 text-[11px] font-medium rounded-full transition-all cursor-pointer ${
                        galleryFilter === btn.key 
                          ? "bg-[#C16B5C] text-white font-semibold shadow-[0_4px_12px_rgba(193,107,92,0.25)]" 
                          : "bg-[#111111] border border-white/10 text-white/70 hover:text-white"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Grid layout for Gallery images with lightbox on demand */}
              <div className="grid grid-cols-2 gap-3">
                <AnimatePresence mode="popLayout">
                  {displayedPhotos.map((img, idx) => (
                    <motion.div 
                      layout
                      key={img.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => {
                        // Find actual index in the root list to make lightboxes work perfectly
                        const fullIndex = GALLERY_ITEMS.findIndex(item => item.id === img.id);
                        setLightboxIndex(fullIndex);
                      }}
                      className="relative rounded-lg overflow-hidden group cursor-zoom-in border border-white/10 bg-[#050505] aspect-[4/3] shadow-md hover:border-[#C16B5C]/55 hover:shadow-[0_4px_16px_rgba(193,107,92,0.25)] transition-all"
                    >
                      <img 
                        src={img.src} 
                        alt={img.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          // Seed specific to id to prevent same visual duplication on error
                          target.src = `https://picsum.photos/seed/${img.id}/400/300`;
                        }}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Info text */}
              <div className="text-right text-[10px] font-mono text-white/40">
                Tip: Kliknutím na jakoukoliv fotografii otevřete detailní prohlížeč v plné velikosti
              </div>

              {/* Button to download all photos */}
              <div className="pt-6 flex justify-end">
                <a
                  href="https://drive.google.com/drive/folders/1c8sn4sdECiSuXhMjkW1umjRQXNFh0fwQ?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#C16B5C]/90 hover:bg-[#B05B4D] text-white font-sans text-xs font-bold uppercase tracking-widest rounded-full hover:-translate-y-0.5 transition-all shadow-[0_4px_16px_rgba(193,107,92,0.25)] hover:shadow-[0_4px_28px_rgba(193,107,92,0.45)] text-center cursor-pointer"
                  id="download-all-photos-btn"
                >
                  <span>📸 Stáhnout všechny fotky</span>
                </a>
              </div>

            </div>

          </div>

          {/* Wide full-width (PDF / Download) secondary CTA - Centered, matching custom premium design */}
          <div className="mt-12 pt-4 border-t border-white/5">
            <button
              onClick={downloadBrochure}
              className="w-full inline-flex items-center justify-between px-6 sm:px-8 py-4.5 bg-gradient-to-r from-[#C16B5C] to-[#B05B4D] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:brightness-110 hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(193,107,92,0.3)] hover:shadow-[0_4px_28px_rgba(193,107,92,0.55)] transition-all active:translate-y-0 cursor-pointer relative font-sans"
              id="download-full-documentation-overview"
            >
              <FileText className="w-4.5 h-4.5 text-white relative z-10" />
              <span className="absolute inset-0 flex items-center justify-center pointer-events-none text-center font-sans tracking-[0.12em] font-extrabold text-white">
                Stáhnout kompletní dokumentaci (PDF)
              </span>
              <div className="w-4.5" /> {/* Balance spacer to align centered text properly */}
            </button>
          </div>
        </div>
      </section>

      {/* 
        3. DŮKLADNÝ PŘEHLED PARAMETRŮ (Specifications panel with real-time interactive UI parameters filter & search)
      */}
      <section id="parameters" className="py-20 lg:py-28 bg-[#050505] border-b border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-block border border-[#C16B5C]/35 bg-[#C16B5C]/10 px-3 py-1 text-[10px] font-mono text-[#C16B5C] tracking-widest uppercase rounded-full mb-3">
                Specifikace nemovitosti
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white animate-fade-in">
                Podrobné parametry
              </h2>
              <p className="text-white/60 text-sm mt-1 max-w-xl">
                Přesný a věcný přehled technických informací odpovídající záznamům v katastru nemovitostí a projektové dokumentaci.
              </p>
            </div>
            
            {/* Search inputs */}
            <div className="w-full md:w-80 relative flex items-center">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 pointer-events-none z-10" />
              <input 
                type="text" 
                placeholder="Hledat parametr (např. voda, stání)..."
                value={paramSearch}
                onChange={(e) => setParamSearch(e.target.value)}
                style={{ paddingLeft: "2.75rem", paddingRight: "2.5rem" }}
                className="w-full py-2.5 bg-[#111111]/90 border border-white/10 text-white rounded-lg text-xs placeholder-white/30 focus:border-[#C16B5C]/50 focus:outline-none focus:ring-1 focus:ring-[#C16B5C]/50 transition-all"
              />
              {paramSearch && (
                <button 
                  onClick={() => setParamSearch("")}
                  className="absolute right-3.5 text-white/40 hover:text-white cursor-pointer flex items-center justify-center p-1 z-10"
                  title="Vymazat vyhledávání"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Categories Selector Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 mb-6">
            {categoriesList.map(cat => (
              <button
                key={cat.key}
                onClick={() => { setParamCategory(cat.key); setIsParamsExpanded(false); }}
                className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                  paramCategory === cat.key 
                    ? "bg-[#C16B5C] text-white shadow-[0_4px_12px_rgba(193,107,92,0.25)]" 
                    : "bg-[#111111] border border-white/10 text-white/70 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Parameters outputs cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {displayedParameters.map((param) => (
                <motion.div
                  layout
                  key={param.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#111111] border border-white/10 rounded-lg p-5 hover:border-[#C16B5C]/40 hover:shadow-[0_4px_20px_rgba(193,107,92,0.08)] transition-all flex items-start gap-4 hover:bg-[#151515] group"
                >
                  <div className="p-2.5 bg-[#050505] text-[#C16B5C] border border-white/10 rounded-lg group-hover:bg-[#C16B5C]/10 group-hover:border-[#C16B5C]/25 transition-all shadow">
                    {/* Render relative key utility icons */}
                    {param.icon === "Home" && <Home className="w-5 h-5" />}
                    {param.icon === "MapPin" && <MapPin className="w-5 h-5" />}
                    {param.icon === "Wallet" && <Wallet className="w-5 h-5" />}
                    {param.icon === "CheckCircle" && <CheckCircle2 className="w-5 h-5" />}
                    {param.icon === "Award" && <Award className="w-5 h-5" />}
                    {param.icon === "Square" && <Compass className="w-5 h-5" />}
                    {param.icon === "Trees" && <Trees className="w-5 h-5" />}
                    {param.icon === "Waves" && <Waves className="w-5 h-5" />}
                    {param.icon === "Car" && <Car className="w-5 h-5" />}
                    {param.icon !== "Home" && param.icon !== "MapPin" && 
                     param.icon !== "Wallet" && param.icon !== "CheckCircle" && 
                     param.icon !== "Award" && param.icon !== "Square" && 
                     param.icon !== "Trees" && param.icon !== "Waves" && 
                     param.icon !== "Car" && <Compass className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-mono tracking-wider text-[#C16B5C] font-bold">{param.category}</span>
                    <span className="block text-white/60 text-xs mt-0.5">{param.label}</span>
                    <span className="block text-white font-bold text-sm mt-0.5">{param.value}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {displayedParameters.length === 0 && (
              <div className="col-span-full text-center py-12 bg-[#111111] rounded-lg border border-dashed border-white/10">
                <span className="block text-sm text-white/50 mb-2">Hledanému výrazu neodpovídá žádný parametr</span>
                <button 
                  onClick={() => { setParamSearch(""); setParamCategory("all"); setIsParamsExpanded(false); }}
                  className="text-[#C16B5C] text-xs font-bold hover:underline cursor-pointer"
                >
                  Obnovit filtry
                </button>
              </div>
            )}
          </div>

          {/* Expand/Collapse parameters button */}
          {paramCategory === "all" && filteredParameters.length > 9 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setIsParamsExpanded(!isParamsExpanded)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#111111] border border-white/10 hover:border-[#C16B5C]/50 text-xs font-mono font-bold uppercase tracking-wider text-[#C16B5C] hover:text-[#B05B4D] hover:-translate-y-0.5 rounded-full transition-all cursor-pointer shadow-md"
                id="toggle-parameters-btn"
              >
                {isParamsExpanded ? "Skrýt zbývající parametry ↑" : "Zobrazit všechny parametry ↓"}
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 
        4. INTERAKTIVNÍ VIZUALIZACE PŮDORYSU (Renders created interactive svg floorplan)
      */}
      <section id="floorplans" className="py-20 lg:py-28 bg-[#111111] border-b border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FloorPlan />
        </div>
      </section>

      {/* 
        5. LOKALITA & INTERAKTIVNÍ MAPA (Stylized Point Of Interest maps linking to google maps URL)
      */}
      <section id="location" className="pt-20 pb-4 lg:pt-28 lg:pb-6 bg-[#050505] border-b border-white/10 relative">
        {/* Style tag overriding default white Leaflet controls & popups with modern terracotta styling */}
        <style dangerouslySetInnerHTML={{ __html: `
          .leaflet-popup-content-wrapper {
            background: #111111 !important;
            color: #F6F0E8 !important;
            border: 1px solid rgba(193, 107, 92, 0.45) !important;
            border-radius: 12px !important;
            box-shadow: 0 10px 30px -10px rgba(0,0,0,0.7) !important;
            padding: 2px !important;
          }
          .leaflet-popup-tip {
            background: #111111 !important;
            border-left: 1px solid rgba(193, 107, 92, 0.45) !important;
            border-bottom: 1px solid rgba(193, 107, 92, 0.45) !important;
          }
          .leaflet-container a.leaflet-popup-close-button {
            color: #F6F0E8 !important;
            padding: 8px 8px 0 0 !important;
          }
          .leaflet-bar {
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            box-shadow: none !important;
          }
          .leaflet-bar a {
            background-color: #111111 !important;
            color: #F6F0E8 !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
          }
          .leaflet-bar a:hover {
            background-color: #1c1c1c !important;
            color: #C16B5C !important;
          }
          #leaflet-map {
            height: 420px !important;
          }
          @keyframes pin-pulse {
            0% {
              transform: scale(0.95);
              opacity: 0.8;
            }
            70% {
              transform: scale(1.4);
              opacity: 0;
            }
            100% {
              transform: scale(0.95);
              opacity: 0;
            }
          }
        `}} />

        {/* Soft elegant terracotta glow representing modern warm luxury */}
        <div className="absolute top-[20%] right-[15%] w-[400px] h-[400px] bg-[#C16B5C]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Block */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-block border border-[#C16B5C]/30 bg-[#C16B5C]/10 px-3 py-1 text-[10px] font-mono text-[#C16B5C] tracking-widest uppercase rounded-full">
              Umístění & Životní styl
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
              Jedinečné bydlení v srdci Předboje
            </h2>
            
            <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans">
              Rozmazlete se venkovským klidem v ulici <strong className="text-white">Dlouhá 210, Předboj</strong> s bezprostřední blízkostí Prahy a špičkovým volnočasovým zázemím doslova za rohem.
            </p>
          </div>

          {/* ČÁST 1: Interaktivní mapa s custom piny */}
          <div className="mb-24">
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-2 relative shadow-2xl overflow-hidden">
              {/* Actual Map Container */}
              <div 
                id="leaflet-map" 
                className="w-full rounded-xl relative z-10 font-sans"
                style={{ height: "420px" }}
              >
                {/* Fallback loading state while leaflet scripts fire */}
                <div className="absolute inset-0 bg-[#0F0F0F] flex flex-col items-center justify-center text-white/50 space-y-2">
                  <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C16B5C]"></span>
                  <p className="text-xs font-mono">Načítání interaktivní mapy...</p>
                </div>
              </div>
            </div>
            
            {/* Legend or hint below the map */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-white/50 px-2 lg:px-4">
              <span className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#C16B5C] animate-pulse" />
                Interaktivní mapa (přibližujte, posouvejte a klikejte na piny pro detaily)
              </span>
              <a 
                href="https://www.google.com/maps/place/Dlouhá+210,+250+72+Předboj-Kojetice+u+Prahy/@50.2287801,14.4785118,200m/data=!3m1!1e3!4m6!3m5!1s0x470be901ab96fd75:0x96e400e17f045d85!8m2!3d50.2288323!4d14.4789659!16s%2Fg%2F11c4t53712?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#C16B5C] hover:text-[#B05B4D] font-bold uppercase text-[10px] sm:text-xs tracking-wider transition-colors"
              >
                Otevřít satelitní mapu Google
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* ČÁST 2: Denní rutina timeline */}
          <div className="relative">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-center text-white mb-16">
              Jak vypadá váš den
            </h3>

            {/* Timeline wrapper to support both responsive directions */}
            <div className="relative">
              {/* Invisible line linking timeline points (visible only on desktop or responsive) */}
              <div className="absolute top-[24px] left-0 right-0 h-0.5 bg-white/5 hidden md:block" />
              <div className="absolute left-[24px] top-0 bottom-0 w-0.5 bg-white/5 md:hidden" />

              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 relative z-10">
                {[
                  {
                    time: "7:00",
                    emoji: "☀️",
                    desc: "Snídaně na zastřešené terase. Zahrada, ticho, žádní sousedé z okna."
                  },
                  {
                    time: "7:45",
                    emoji: "🚗",
                    desc: "Nasednete do auta. Klidná ulice, výjezd z obce za 2 minuty."
                  },
                  {
                    time: "8:10",
                    emoji: "🚇",
                    desc: "Parkujete u metra Letňany. Do centra Prahy 15 minut metrem."
                  },
                  {
                    time: "17:30",
                    emoji: "🏡",
                    desc: "Zpět domů. 20 minut z Letňan, žádná zácpa opačným směrem."
                  },
                  {
                    time: "18:00",
                    emoji: "🏊",
                    desc: "Bazén v zahradě. Soukromí, slunce na jih, Yard Resort za rohem."
                  }
                ].map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                    className="flex md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-6 relative"
                  >
                    {/* Node Circle */}
                    <div className="w-12 h-12 rounded-full bg-[#111111] border-2 border-[#C16B5C] flex items-center justify-center text-xl shadow-lg shrink-0 relative z-20 md:hover:scale-110 transition-transform duration-200">
                      <span>{step.emoji}</span>
                    </div>

                    {/* Content text */}
                    <div className="flex-1 space-y-1 sm:space-y-2 mt-1 md:mt-0 px-2 flex flex-col md:items-center">
                      <div className="text-base sm:text-lg font-bold font-sans text-white">
                        {step.time}
                      </div>
                      <p className="text-xs sm:text-sm text-white/70 font-sans leading-relaxed md:max-w-[180px] border border-white/10 rounded-xl p-3 bg-white/[0.02]">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 
        6. REZERVAČNÍ FORMULÁŘ & KONTAKTNÍ VIZITKA
      */}
      <section id="contact" className="pt-10 pb-20 lg:pt-14 lg:pb-28 bg-[#111111] relative overflow-hidden">
        
        {/* Absolute red terracotta corner decoration light */}
         <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#C16B5C]/5 rounded-full blur-[110px] pointer-events-none" />
 
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Vertical layout header centering the primary CTA */}
          <div className="flex flex-col items-center text-center space-y-6 mb-10">
            <div className="inline-block border border-[#C16B5C]/30 bg-[#C16B5C]/10 px-3 py-1 text-[10px] font-mono text-[#C16B5C] tracking-widest uppercase rounded-full font-bold">
              Rezervace prohlídky
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
              Máte zájem o osobní prohlídku?
            </h2>

            <div className="pt-2 w-full flex justify-center">
              <div className="relative inline-flex items-center justify-center">
                <a 
                  href="tel:+420724562682"
                  className="inline-flex items-center justify-center gap-3 pl-8 pr-16 py-5 bg-[#C16B5C] hover:bg-[#B05B4D] text-white text-base sm:text-lg font-sans font-extrabold uppercase tracking-widest rounded-full shadow-[0_4px_16px_rgba(193,107,92,0.3)] hover:shadow-[0_4px_28px_rgba(193,107,92,0.5)] transition-all active:translate-y-0 cursor-pointer"
                >
                  📞 Zavolejte: 724 562 682
                </a>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    copyPhoneNumber();
                  }}
                  className="absolute right-4 p-2.5 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center border border-white/10"
                  title="Kopírovat telefonní číslo"
                >
                  {phoneCopied ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Copy className="w-4 h-4 text-white/90 shrink-0" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-sm sm:text-base text-white/80 max-w-xl leading-relaxed font-sans">
              Rádi Vás provedeme domem i zahradou a odpovíme na všechny dotazy.
            </p>
          </div>

          <div className="w-full flex items-center justify-center gap-4 my-10">
            <div className="h-[1px] bg-white/10 flex-1"></div>
            <span className="text-xs uppercase font-mono tracking-widest text-white/40 font-bold whitespace-nowrap">Nebo nám napište</span>
            <div className="h-[1px] bg-white/10 flex-1"></div>
          </div>

          {/* Reservation Form */}
          <div className="w-full bg-[#050505] border border-white/10 rounded-lg p-6 sm:p-10 shadow-2xl relative">
            
            <AnimatePresence mode="wait">
              {!formSubmitted ? (
                <motion.form
                  key="reservation-form"
                  onSubmit={handleFormSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-[#C16B5C] uppercase font-bold">Celé jméno a příjmení</label>
                      <input 
                        type="text" 
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="Např. Jan Novák"
                        className="w-full text-sm bg-[#111111] border border-white/10 text-white rounded-lg p-3 focus:border-[#C16B5C]/50 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-[#C16B5C] uppercase font-bold">E-mailová adresa</label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="Např. novak@seznam.cz"
                        className="w-full text-sm bg-[#111111] border border-white/10 text-white rounded-lg p-3 focus:border-[#C16B5C]/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-[#C16B5C] uppercase font-bold">Telefonní kontakt</label>
                      <input 
                        type="tel" 
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleFormChange}
                        placeholder="Např. +420 777 123 456"
                        className="w-full text-sm bg-[#111111] border border-white/10 text-white rounded-lg p-3 focus:border-[#C16B5C]/50 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-[#C16B5C] uppercase font-bold">Preferované datum prohlídky</label>
                      <input 
                        type="date" 
                        name="date"
                        value={formData.date}
                        onChange={handleFormChange}
                        className="w-full text-sm bg-[#111111] border border-white/10 text-white rounded-lg p-3 focus:border-[#C16B5C]/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-[#C16B5C] uppercase font-bold">Doplňující vzkaz / Dotaz</label>
                      <textarea 
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleFormChange}
                        placeholder="Zde napište, o jaké doplňující parametry či dotazy máte zájem..."
                        className="w-full text-sm bg-[#111111] border border-white/10 text-white rounded-lg p-3 min-h-[100px] focus:border-[#C16B5C]/50 focus:outline-none"
                      />
                    </div>

                    {/* Catalog delivery option switcher */}
                    <div className="flex items-center gap-3.5 py-2">
                      <input 
                        type="checkbox" 
                        id="deliveryCatalog"
                        name="deliveryCatalog"
                        checked={formData.deliveryCatalog}
                        onChange={(e) => setFormData(prev => ({ ...prev, deliveryCatalog: e.target.checked }))}
                        className="w-5 h-5 accent-[#C16B5C] border-white/10 rounded-lg shrink-0 cursor-pointer"
                      />
                      <label htmlFor="deliveryCatalog" className="text-xs text-white/80 cursor-pointer select-none">
                        Zároveň mi zaslat schválený technický list s kompletní dokumentací a výpisem sítě (PDF/TXT) na e-mail.
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#C16B5C] hover:bg-[#B05B4D] text-white text-sm font-sans font-bold rounded-full shadow-[0_4px_16px_rgba(193,107,92,0.3)] hover:shadow-[0_4px_28px_rgba(193,107,92,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                        id="submit-reservation"
                      >
                        Odeslat nezávaznou poptávku
                        <Check className="w-4 h-4 text-white" />
                      </button>
                    </div>

                  </motion.form>
                ) : (
                  <motion.div
                    key="thank-you-notification"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10 space-y-6"
                  >
                    <div className="w-16 h-16 bg-[#8B9A7C]/20 border border-[#8B9A7C]/40 rounded-full flex items-center justify-center mx-auto text-[#8B9A7C]">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-2xl font-bold font-sans text-white">Děkujeme za Váš zájem!</h4>
                      <p className="text-sm text-[#F6F0E8]/80 max-w-md mx-auto leading-relaxed">
                        Poptávka na dům <strong>Rezidence Předboj</strong> byla úspěšně zpracována. Na zadané číslo <strong className="text-white">{formData.phone || "+420 X  "}</strong> se Vám spojíme nejpozději během zítřejšího dne k domluvení termínu.
                      </p>
                      {formData.deliveryCatalog && (
                        <p className="text-xs font-mono text-[#8B9A7C]">
                          Technická specifikace a PDF list byl odeslán na adresu: {formData.email}
                        </p>
                      )}
                    </div>

                    <button 
                      onClick={() => {
                        setFormSubmitted(false);
                        setFormData({
                          name: "",
                          email: "",
                          phone: "",
                          date: "",
                          message: "",
                          deliveryCatalog: true
                        });
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-[#C16B5C] font-bold font-sans hover:underline cursor-pointer"
                    >
                      Odeslat novou poptávku
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
        </div>
      </section>

      {/* Lightbox Modal Projection on demand with full size image viewing controls */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-8 no-print cursor-zoom-out"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Soft backdrop decorator */}
            <div className="absolute top-4 right-4 z-10 flex gap-4">
              <button 
                onClick={downloadBrochure}
                className="bg-[#211814]/80 text-[#F6F0E8] border border-[#8B9A7C]/30 p-2.5 rounded-xl hover:bg-[#322620] transition-colors"
                title="Stáhnout prospekt"
              >
                <Download className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setLightboxIndex(null)}
                className="bg-[#211814]/80 text-white border border-[#8B9A7C]/30 p-2.5 rounded-xl hover:bg-[#C16B5C] hover:text-white transition-colors"
                title="Zavřít galerii"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lightbox Slider container */}
            <div className="relative max-w-4xl w-full flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
              
              {/* Back control */}
              <button
                onClick={() => {
                  setLightboxIndex(prev => 
                    prev !== null ? (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length : null
                  );
                }}
                className="absolute left-2 sm:-left-16 top-1/2 -translate-y-1/2 p-3 bg-black/95 border border-white/10 rounded-full hover:bg-[#C16B5C] hover:text-white transition-all text-white cursor-pointer z-10"
              >
                <ChevronLeft className="w-5 h-5 animate-pulse" />
              </button>

              <img 
                src={GALLERY_ITEMS[lightboxIndex].src} 
                alt={GALLERY_ITEMS[lightboxIndex].title} 
                referrerPolicy="no-referrer"
                className="w-full max-h-[75vh] object-contain rounded-lg shadow-2xl border border-white/10"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const currentId = GALLERY_ITEMS[lightboxIndex].id;
                  target.src = `https://picsum.photos/seed/${currentId}/800/600`;
                }}
              />

              {/* Title descriptions */}
              <div className="text-center space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#C16B5C] font-bold">
                  Snímek {lightboxIndex + 1} z {GALLERY_ITEMS.length} • {GALLERY_ITEMS[lightboxIndex].category === "exterior" ? "Zahrada / Venk" : "Interiér"}
                </span>
                <h4 className="text-base font-bold text-white font-serif">{GALLERY_ITEMS[lightboxIndex].title}</h4>
              </div>

              {/* Forward control */}
              <button
                onClick={() => {
                  setLightboxIndex(prev => 
                    prev !== null ? (prev + 1) % GALLERY_ITEMS.length : null
                  );
                }}
                className="absolute right-2 sm:-right-16 top-1/2 -translate-y-1/2 p-3 bg-black/95 border border-white/10 rounded-full hover:bg-[#C16B5C] hover:text-white transition-all text-white cursor-pointer z-10"
              >
                <ChevronRight className="w-5 h-5 animate-pulse" />
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        FOOTER SECTION: Clean design with license and compliance standards
      */}
      <footer className="bg-[#050505] text-white/50 text-xs py-12 border-t border-white/10 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-white/10 pb-8 mb-8">
            
            <div className="md:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#111111] border border-white/15 flex items-center justify-center rounded-lg">
                  <span className="font-serif font-bold text-xs text-[#C16B5C]">RP</span>
                </div>
                <span className="text-sm font-serif font-bold text-white tracking-wider">REZIDENCE PŘEDBOJ</span>
              </div>
              <p className="text-white/60 text-xs leading-relaxed max-w-sm font-sans">
                Exkluzivní a tiché rodinné zázemí s bazénem, garáží a teplovodním krbem. Projekt splňující ty nejnáročnější parametry dětí i rodičů.
              </p>
            </div>

            <div className="md:col-span-3 md:col-start-10 space-y-3 md:text-right flex flex-col md:items-end">
              <span className="block text-[10px] uppercase font-mono tracking-widest text-[#C16B5C] font-bold">Rychlé volby</span>
              <div className="flex flex-col gap-2 items-start md:items-end animate-none">
                <a 
                  href="https://drive.google.com/file/d/1B0IiydGtr42CP52LfnzgJZQNaBLOCVVK/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#111111] text-white border border-white/10 px-4 py-1.5 rounded-full text-[10px] hover:border-[#C16B5C] hover:text-[#C16B5C] transition-all inline-flex items-center gap-1 cursor-pointer font-sans"
                >
                  📄 Stáhnout dokumentaci
                </a>
                <a 
                  href="https://drive.google.com/drive/folders/1c8sn4sdECiSuXhMjkW1umjRQXNFh0fwQ?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#111111] text-white border border-white/10 px-4 py-1.5 rounded-full text-[10px] hover:border-[#C16B5C] hover:text-[#C16B5C] transition-all inline-flex items-center gap-1 cursor-pointer font-sans"
                >
                  📸 Stáhnout fotky
                </a>
              </div>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-white/30">
            <div>
              <span>© {new Date().getFullYear()} Rezidence Předboj • Všechna práva vyhrazena.</span>
            </div>
            <div className="flex gap-4">
              <span>GDPR Informační doložka</span>
              <span>•</span>
              <span className="text-[#C16B5C]">Developer Partnering 2026</span>
            </div>
          </div>
        </div>
      </footer>



    </div>
  );
}
