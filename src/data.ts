import { PropertyParameter, GalleryItem } from "./types";

export const PROPERTY_PARAMETERS: PropertyParameter[] = [
  { label: "Velikost / Dispozice", value: "5 a více pokojů (6+kk)", category: "základní", icon: "LayoutGrid" },
  { label: "Cena", value: "16 295 000 Kč", category: "základní", icon: "Wallet" },
  { label: "Užitná plocha", value: "159 m²", category: "výměry", icon: "Scale" },
  { label: "Plocha pozemku", value: "792 m²", category: "výměry", icon: "Square" },
  { label: "Lokalita", value: "Dlouhá 210, Předboj", category: "základní", icon: "MapPin" },
  { label: "Velikost bazénu", value: "21 m² (3 x 7 m)", category: "výměry", icon: "Waves" },
  { label: "Garáž", value: "Ano (1 garáž)", category: "vybavení", icon: "Car" },
  { label: "Stav objektu", value: "Velmi dobrý", category: "základní", icon: "Award" },
  { label: "Dostupnost autem", value: "Cca 20 min do Prahy (Letňany)", category: "lokalita", icon: "Compass" },

  { label: "Kategorie", value: "Rodinné domy", category: "základní", icon: "Home" },
  { label: "Poznámka k ceně", value: "Včetně DPH, poplatků, provize a právního servisu", category: "základní", icon: "CheckCircle" },
  
  { label: "Zastavěná plocha", value: "114 m²", category: "výměry", icon: "Columns" },
  { label: "Plocha zahrady", value: "678 m²", category: "výměry", icon: "Trees" },
  { label: "Podlahová plocha", value: "132 m²", category: "výměry", icon: "Maximize" },
  { label: "Zastřešená terasa", value: "15 m²", category: "výměry", icon: "Compass" },
  { label: "Plocha dílen", value: "11 m²", category: "výměry", icon: "FileText" },

  { label: "Budova", value: "Cihlová", category: "technické", icon: "Brick" },
  { label: "Typ domu", value: "Patrový", category: "technické", icon: "Home" },
  { label: "Poloha objektu", value: "Samostatný", category: "technické", icon: "Home" },
  { label: "Umístění", value: "Klidná část obce", category: "technické", icon: "Navigation" },
  { label: "Rok výstavby", value: "2006", category: "technické", icon: "Calendar" },
  { label: "Energetická náročnost", value: "Třída G (PENB nedodán)", category: "technické", icon: "ZapOff" },
  { label: "Zařízený", value: "Částečně", category: "technické", icon: "Home" },
  { label: "Voda", value: "Místní zdroj", category: "technické", icon: "Droplets" },
  { label: "Elektřina", value: "230 V", category: "technické", icon: "Zap" },
  { label: "Odpad", value: "Veřejná kanalizace", category: "technické", icon: "Activity" },
  { label: "Topení", value: "Lokální tuhá paliva, ústřední elektrické", category: "technické", icon: "Flame" },

  { label: "Parkování", value: "Ano – 2 venkovní stání", category: "vybavení", icon: "Car" },
  { label: "Terasa", value: "Ano (15 m²)", category: "vybavení", icon: "Compass" },
  { label: "Bazén", value: "Ano (21 m²)", category: "vybavení", icon: "Waves" },
  { label: "Komunikace", value: "Betonová", category: "vybavení", icon: "Navigation" },
  { label: "Telekomunikace", value: "Telefon, Internet", category: "vybavení", icon: "Wifi" },

  { label: "Obec", value: "Předboj (okres Praha-východ)", category: "lokalita", icon: "Map" },
  { label: "Dostupnost MHD", value: "Autobusem nebo vlakem", category: "lokalita", icon: "Bus" },
  { label: "Sport & Relaxace", value: "Nedaleko golfový resort Yard Resort", category: "lokalita", icon: "Compass" },
  { label: "Vhodné pro", value: "Větší rodinu s dětmi", category: "lokalita", icon: "Smile" },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gallery-new-1",
    title: "Celkový pohled na dům z jižní zahrady",
    src: "https://lh3.googleusercontent.com/d/1nhzyL8G7fXF-KerqXkdf2rNyS8JuuG3q",
    category: "exterior"
  },
  {
    id: "gallery-new-2",
    title: "Celkový pohled na dům shora",
    src: "https://lh3.googleusercontent.com/d/17Tgjmkrk8nf7_QUZgjgahRSNYL7k2W_n",
    category: "exterior"
  },
  {
    id: "gallery-new-3",
    title: "Světlý podkrovní pokoj",
    src: "https://lh3.googleusercontent.com/d/1ecmi1iCw80u7iIDNZtB_gvhcxqHhArbV",
    category: "interior"
  },
  {
    id: "gallery-new-4",
    title: "Obytný prostor s kuchyní a jídelnou",
    src: "https://lh3.googleusercontent.com/d/1AnwzltKrD11ZkpSf-OTDcw6HwB9DhG26",
    category: "interior"
  }
];

export function downloadBrochure() {
  const url = "https://drive.google.com/file/d/1B0IiydGtr42CP52LfnzgJZQNaBLOCVVK/view?usp=sharing";
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
