import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, 
  DoorClosed, 
  Bed, 
  Bath, 
  ChefHat, 
  Info,
  Car,
  Wrench,
  Hammer,
  Map,
  Compass,
  Camera,
  Maximize2,
  X,
  Eye,
  Trees,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface InteractiveRoom {
  id: number;
  name: string;
  area: string;
  description: string;
  polygon: string; // 3D coordinates
  polygon2d: string; // 2D coordinates
  center: { x: number; y: number }; // 3D label center
  center2d: { x: number; y: number }; // 2D label center
  iconName: string;
  materials: string[];
  equipment: string[];
  photoUrl?: string; // photo path if available
}

interface InteractiveFloor {
  level: string; // "1.NP" or "2.NP"
  title: string;
  totalArea: string;
  description: string;
  imageUrl: string;
  rooms: InteractiveRoom[];
}

const FLOORS_DATA: InteractiveFloor[] = [
  {
    level: "1.NP",
    title: "Přízemí (1. Nadzemní podlaží)",
    totalArea: "81,66 m² (obytná) + 11,81 m² (garáž) + 15 m² (terasa)",
    description: "Společenská zóna plná světla spojená se zastřešenou jižní terasou, vestavěnou garáží, kompletním zázemím a moderním krbem.",
    imageUrl: "https://lh3.googleusercontent.com/d/1U5ASDXQmp4CEdVxfbzfNO2pWGgIrHIJh",
    rooms: [
      {
        id: 1,
        name: "Předsíň",
        area: "5,43 m²",
        description: "Vstupní zádveří izoluje obytný prostor od vlivů počasí a nabízí přímý domovní průchod do garáže pro naprosté sucho i pohodlí při návratu z cest.",
        polygon: "30,45 45,45 45,90 30,90",
        polygon2d: "28,65 38,65 38,95 28,95",
        center: { x: 37.5, y: 67.5 },
        center2d: { x: 33, y: 80 },
        iconName: "Home",
        materials: [
          "Keramická velkoformátová rektifikovaná dlažba",
          "Zátěžová soklová lišta v uceleném dekoru",
          "Elektrický podlahový topný rošt s programovatelným termostatem"
        ],
        equipment: [
          "Prémiové zateplené vchodové dveře s vícebodovým zámkem",
          "Příprava pro širokou vestavěnou šatní stěnu a zrcadlo",
          "Zabudované stropní LED osvětlení"
        ]
      },
      {
        id: 2,
        name: "Garáž",
        area: "11,81 m²",
        description: "Moderní garáž pro jedno vozidlo zaručuje pohodlné parkování a spoustu přizpůsobitelného prostoru pro uložení sezónních věcí, nářadí, pneumatik či kol.",
        polygon: "5,45 30,45 30,90 5,90",
        polygon2d: "5,55 28,55 28,95 5,95",
        center: { x: 17.5, y: 67.5 },
        center2d: { x: 16, y: 75 },
        iconName: "Car",
        materials: [
          "Leštěný betonový potěr s otěruvzdorným epoxidovým nátěrem",
          "Vysoce odolná omyvatelná barva na stěnách",
          "Zesílená tepelná izolace stěny sousedící s obytným prostorem"
        ],
        equipment: [
          "Zateplená sekční garážová vrata Hörmann s dálkovým elektrickým pohonem",
          "Příparava pro 400V zásuvku na rychlé nabíjení elektrických vozu (EV)",
          "Samostatný přirozený ventilační odtahový průduch"
        ]
      },
      {
        id: 3,
        name: "Koupelna + WC",
        area: "4,97 m²",
        description: "Koupelna v přízemí disponuje walk-in sprchovým koutem, vlastním stropním odvětráním a diskrétně skrytou přípravou pro pračku i sušičku.",
        polygon: "46,65 70,65 70,90 46,90",
        polygon2d: "38,72 58,72 58,95 38,95",
        center: { x: 58, y: 77.5 },
        center2d: { x: 48, y: 83 },
        iconName: "Bath",
        photoUrl: "https://lh3.googleusercontent.com/d/1DuHIQ2YMuPpZVmV2QMcjI4meukCw4CbH",
        materials: [
          "Zemitá protiskluzová keramická dlažba a designový obklad španělské produkce",
          "Epoxidová voděodolná spárovací hmota zamezující vzniku plísní",
          "Nerezový liniový odtokový sprchový žlab s pachovou uzávěrou"
        ],
        equipment: [
          "Bezrámová walk-in skleněná sprchová zástěna ze 12mm kaleného skla",
          "Podomítkový závěsný splachovací systém Geberit",
          "Umyvadlová skříňka se tichým dovíráním a nerezovými bateriemi Grohe",
          "Přívod and odpad pro pračku and sušičku v samostatném výklenku"
        ]
      },

      {
        id: 4,
        name: "Chodba",
        area: "6,17 m²",
        description: "Komunikační jádro celého přízemí chytře odděluje technické zázemí od klidných částí a uvozuje nástup na široké celodřevěné schodiště.",
        polygon: "46,45 58,45 58,65 46,65",
        polygon2d: "38,50 65,50 65,72 38,72",
        center: { x: 52, y: 55 },
        center2d: { x: 51, y: 61 },
        iconName: "DoorClosed",
        photoUrl: "https://lh3.googleusercontent.com/d/1MOhH53Nc0mDfN88TlJ5mHosayWVSzvB3",
        materials: [
          "Pevnostní zátěžový vinyl s tlumivou kročejovou podložkou",
          "Designové dřevěné vnitřní obložky a dveře Sapeli s magnetickým zámkem",
          "Masivní jasanové obložení schodišťových stupňů"
        ],
        equipment: [
          "Orientační noční nástěnná bodová světla",
          "Bytový rozvaděč se samostatně jištěnými okruhy",
          "Centrální digitální termostat zónového vytápění"
        ]
      },
      {
        id: 5,
        name: "Pokoj pro hosty / pracovna",
        area: "8,83 m²",
        description: "Pokoj s výhledem do klidné ulice. Je výborně využitelný jako tichá domácí pracovna nebo samostatný pokoj pro pohodlné přespání rodinných návštěv.",
        polygon: "70,55 95,55 95,90 70,90",
        polygon2d: "65,55 95,55 95,95 65,95",
        center: { x: 82.5, y: 72.5 },
        center2d: { x: 80, y: 75 },
        iconName: "Bed",
        photoUrl: "https://lh3.googleusercontent.com/d/1vOr24qj4H3L8MK65rOHjknVjN8gadJEe",
        materials: [
          "Vinylová podlaha s vysokou hustotou a dubovou dýhou",
          "Sádrokartonový odhlučněný podhled s minerální akustickou vatou",
          "Hladké štukové omítky s paropropustnou ekologickou barvou"
        ],
        equipment: [
          "Integrované datové internetové zásuvky (RJ45)",
          "Příprava na zapojení stropní klimatizační jednotky",
          "Ventilační křídlo okna s nastavitelnou mikroventilací"
        ]
      },
      {
        id: 6,
        name: "Obývací pokoj + KK",
        area: "40,63 m²",
        description: "Velkolepý obytný prostor propojuje špičkovou kuchyni a útulnou krbovou zónu. Trojice francouzských oken jej navíc otevírá rovnou k zastřešené jižní terase a bazénu.",
        polygon: "30,10 95,10 95,55 58,55 58,40 30,40",
        polygon2d: "28,5 95,5 95,55 65,55 65,50 38,50 38,55 28,55",
        center: { x: 62.5, y: 27.5 },
        center2d: { x: 58, y: 28 },
        iconName: "ChefHat",
        photoUrl: "https://lh3.googleusercontent.com/d/1AnwzltKrD11ZkpSf-OTDcw6HwB9DhG26",
        materials: [
          "Vinylová elastická podlaha v barvě světlého jasanu navržená for podlahové vytápění",
          "Krbové těleso obložené přírodním štípaným pískovcem",
          "Zátěžová omyvatelná stěna za plánovanou kuchyňskou zástěnou"
        ],
        equipment: [
          "Moderní krb s teplovzdušným výměníkem a průduchy vedenými do obou podkrovních pokojů",
          "Luxusní kuchyňská sestava na míru s integrovanými spotřebiči třídy A (AEG, Bosch)",
          "Elektrické venkovní rolety na oknech s dálkovým ovládáním",
          "Francouzská okna se sítěmi proti hmyzu"
        ]
      },
      {
        id: 7,
        name: "Spíž",
        area: "3,82 m²",
        description: "Praktická chladnější spíž pro přehledné ukládání potravin, kuchyňských přístrojů. Nachází se diskrétně schovaná hnem vedle kuchyňské linky.",
        polygon: "5,10 30,10 30,40 5,40",
        polygon2d: "38,40 52,40 52,50 38,50",
        center: { x: 17.5, y: 25 },
        center2d: { x: 45, y: 45 },
        iconName: "Info",
        materials: [
          "Otěruvzdorná nenasákavá bílá dlažba na podlaze",
          "Bakteriostaticky upravená bílá omyvatelná malba"
        ],
        equipment: [
          "Zabudovaný systém masivních dřevěných polic s vysokou nosností",
          "Zasazená napájecí zásuvka na 230V vhodná pro přídavný mrazák",
          "Elektrický ventilátor na nezávislé dálkové spínání"
        ]
      }
    ]
  },
  {
    level: "2.NP",
    title: "Podkroví (2. Nadzemní podlaží)",
    totalArea: "72,18 m² (obytná)",
    description: "Klidová zóna s manželskou ložnicí, dvěma dětskými pokoji, rodinnou koupelnou a samostatnou pracovní místností.",
    imageUrl: "https://lh3.googleusercontent.com/d/1gXk0Cclsiu6JlBQsoNgRm7XVngSlfLdH",
    rooms: [
      {
        id: 1,
        name: "Chodba + Schodiště",
        area: "6,34 m²",
        description: "Vzdušný propojovací prostor v patře zaručuje dostatek denního světla díky střešnímu oknu a zajišťuje bezpečné schodišťové stoupání.",
        polygon: "35,42 55,42 55,88 35,88",
        polygon2d: "38,38 58,38 58,72 38,72",
        center: { x: 45, y: 65 },
        center2d: { x: 48, y: 55 },
        iconName: "DoorClosed",
        photoUrl: "https://lh3.googleusercontent.com/d/1uxwg9vMWI4ca9qU51eXNZJEJ_GfrOVcJ",
        materials: [
          "Dřevěné obklady schodů z drahého masivního jasanu",
          "Vinylová teplá podlahová krytina"
        ],
        equipment: [
          "Noční automatické orientační LED osvětlení se senzorem pohybu",
          "Výklopný zateplený stropní žebřík ke skladovacímu srubu na půdě"
        ]
      },
      {
        id: 2,
        name: "Dětský pokoj 1",
        area: "10,17 m²",
        description: "Velmi slunný podkrovní pokoj s šikmou stěnou situovaný na klidnou stranu zahrady, zaručující bezpečné zázemí pro vaše dítě.",
        polygon: "55,48 95,48 95,88 55,88",
        polygon2d: "58,52 95,52 95,95 58,95",
        center: { x: 75, y: 68 },
        center2d: { x: 76, y: 73 },
        iconName: "Bed",
        photoUrl: "https://lh3.googleusercontent.com/d/1bphH_kkkH6cqGnZWv3hhwPoiDOZ65cfC",
        materials: [
          "Zdravotně nezávadný ekologický vinyl bez těžkých kovů",
          "Protiplísňové hypoalergenní vnitřní malby stěn"
        ],
        equipment: [
          "Zatemňovací okenní roleta Velux se spolehlivým solárním napájením",
          "Vestavná knihovnička na míru"
        ]
      },
      {
        id: 3,
        name: "Pracovna",
        area: "11,92 m²",
        description: "Dostatečně prostorná podkrovní pracovna, která nabízí ideální tiché a klidné zónování pro maximálně soustředěnou práci na dálku.",
        polygon: "50,10 95,10 95,45 50,45",
        polygon2d: "58,5 95,5 95,52 58,52",
        center: { x: 72.5, y: 27.5 },
        center2d: { x: 76, y: 28 },
        iconName: "Bed",
        photoUrl: "https://lh3.googleusercontent.com/d/1oBPdNgTDaJp7Ok_OLCIUOSVN3D48YCb4",
        materials: [
          "Super tichý akustický vinyl s korkovou mezivrstvou tlumící hluk",
          "Sádrokartonové akustické mezibytové příčky"
        ],
        equipment: [
          "Rohový masivní stůl s integrovanými skříňkami",
          "Dedikované internetové zásuvky (RJ45)",
          "Samostatná klimatizační jednotka s dálkovým ovládáním"
        ]
      },
      {
        id: 4,
        name: "Koupelna + WC",
        area: "5,61 m²",
        description: "Královská koupelna v patře vybavená velkou rohovou akrylátovou vanou, umyvadlovou sestavou a vlastním střešním větráním.",
        polygon: "35,10 50,10 50,40 35,40",
        polygon2d: "38,5 58,5 58,38 38,38",
        center: { x: 42.5, y: 25 },
        center2d: { x: 48, y: 21 },
        iconName: "Bath",
        photoUrl: "https://lh3.googleusercontent.com/d/1u3z4AWetJlwW6JA4QSly2GfCOb9eu3WB",
        materials: [
          "Prémiové italské rektifikované keramické obklady a dlažba",
          "Teplovodní podlahové vytápění s přesnou ruční regulací"
        ],
        equipment: [
          "Designová luxusní rohová vana od osvědčené české značky Ravak",
          "Dvojité umyvadlo usazené na dubové masivní desce se zásuvkami",
          "Vysoký nerezový koupelnový topný žebřík"
        ]
      },
      {
        id: 5,
        name: "Dětský pokoj 2",
        area: "13,97 m²",
        description: "Velkorysý prostor s dostatkem místa pro rozložení herního plánu, psacího stolu a velkých šatních skříní.",
        polygon: "5,10 35,10 35,45 5,45",
        polygon2d: "5,5 38,5 38,52 5,52",
        center: { x: 20, y: 27.5 },
        center2d: { x: 21, y: 28 },
        iconName: "Bed",
        photoUrl: "https://lh3.googleusercontent.com/d/1-vsilogs6clxp_m24stXAj0LJ0jcdFrG",
        materials: [
          "Laminátová tlumivá podlaha s dekorem světlého dřeva",
          "Dvojitý sádrokarton pro zvýšenou akustickou neprůzvučnost"
        ],
        equipment: [
          "Praktická vestavěná rohová skříň na kompletní dětskou výbavu",
          "Bezračnostní doplňková pojistka proti otevření oken dětmi"
        ]
      },
      {
        id: 6,
        name: "Master Ložnice",
        area: "14,22 m²",
        description: "Hlavní ložnice pro rodiče s dostatkem ticha a soukromí, nabízející výhled přes jižní zahradu rovnou na bazén.",
        polygon: "5,48 35,48 35,88 5,88",
        polygon2d: "5,52 38,52 38,95 5,95",
        center: { x: 20, y: 68 },
        center2d: { x: 21, y: 73 },
        iconName: "Bed",
        photoUrl: "https://lh3.googleusercontent.com/d/114nBqwnOrEnTD993QyubWSYQH97Wzd99",
        materials: [
          "Prvotřídní vinylová podlaha v teplém medovém odstínu dubu",
          "Prémiová designová vliesová tapeta tvořící luxusní čelo lůžka"
        ],
        equipment: [
          "Manželská postel King Size typu Boxspring",
          "Vestavná šatní skříň na zakázku s uceleným LED podsvícením polic",
          "Příprava pro instalaci tichého stropního větráku"
        ]
      }
    ]
  }
];

const BUTTON_POSITIONS: Record<string, Record<number, { left: string; top: string }>> = {
  "1.NP": {
    1: { left: "67.4%", top: "44.9%" }, // Předsíň
    2: { left: "85.7%", top: "45.2%" }, // Garáž
    3: { left: "63.4%", top: "29.4%" }, // Koupelna+WC
    4: { left: "54.2%", top: "33.3%" }, // Chodba
    5: { left: "46.0%", top: "22.4%" }, // Pokoj pro hosty
    6: { left: "41.0%", top: "53.8%" }, // Obývací pokoj+KK
    7: { left: "53.1%", top: "42.1%" }, // Spíž
  },
  "2.NP": {
    1: { left: "50.1%", top: "45.0%" }, // Chodba
    2: { left: "65.0%", top: "62.5%" }, // Dětský pokoj 1
    3: { left: "69.5%", top: "39.7%" }, // Pracovna
    4: { left: "55.3%", top: "24.1%" }, // Koupelna+WC
    5: { left: "31.6%", top: "19.9%" }, // Pokoj
    6: { left: "24.4%", top: "47.5%" }, // Ložnice
  }
};

const GARDEN_PHOTOS = [
  "https://lh3.googleusercontent.com/d/1_f-uFCVgWmfKhp4jH-bEtTmUcDAvHde-",
  "https://lh3.googleusercontent.com/d/10NyVrXSFnKOZdBl2QAzoafQ1-gs4CH9I",
  "https://lh3.googleusercontent.com/d/1KEDj14lFItNHxCFVlqQE_zXYh3Y5Fr_r",
  "https://lh3.googleusercontent.com/d/1tQ8sResSou375CZW8eZv0V4VuM8laC0c",
  "https://lh3.googleusercontent.com/d/1tQbMMqJSm_wolX4kuAg2Ovo8zZovjV1s",
  "https://lh3.googleusercontent.com/d/1OGy_l22ynA4eppl6XRAth2D0aWHh-Gbs",
  "https://lh3.googleusercontent.com/d/1mCYPqFrC_2HK4DLhOIjN3vX_su-9A1cs"
];

export default function FloorPlan() {
  const [activeTab, setActiveTab ] = useState<"1.NP" | "2.NP" | "Zahrada">("1.NP");
  const [selectedRoomId, setSelectedRoomId] = useState<number>(6); // Default is living room (id: 6) as active
  const [hoveredRoomId, setHoveredRoomId] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [lightboxRoom, setLightboxRoom] = useState<InteractiveRoom | null>(null);
  const [gardenLightboxPhoto, setGardenLightboxPhoto] = useState<string | null>(null);
  const [imageAspect, setImageAspect] = useState<number | null>(null);

  const activeFloorIdx = activeTab === "2.NP" ? 1 : 0;
  const currentFloor = FLOORS_DATA[activeFloorIdx];
  const selectedRoom = currentFloor.rooms.find(r => r.id === selectedRoomId) || currentFloor.rooms[0];
  const hoveredRoom = hoveredRoomId !== null ? currentFloor.rooms.find(r => r.id === hoveredRoomId) : null;

  const handleFloorChange = (tab: "1.NP" | "2.NP") => {
    setActiveTab(tab);
    setImageAspect(null);
    const idx = tab === "2.NP" ? 1 : 0;
    const floor = FLOORS_DATA[idx];
    // Default to the first room of that floor (id: 1)
    const defaultRoom = floor.rooms[0];
    setSelectedRoomId(defaultRoom ? defaultRoom.id : 1);
  };

  const handleRoomClick3D = (room: InteractiveRoom) => {
    setSelectedRoomId(room.id);
    setLightboxRoom(room);
  };

  const handleRoomClick2D = (roomId: number) => {
    setSelectedRoomId(roomId);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const getRoomIcon = (iconName: string, className: string = "w-5 h-5") => {
    switch (iconName) {
      case "Home": return <Home className={className} />;
      case "Car": return <Car className={className} />;
      case "Bath": return <Bath className={className} />;
      case "Bed": return <Bed className={className} />;
      case "ChefHat": return <ChefHat className={className} />;
      default: return <DoorClosed className={className} />;
    }
  };

  return (
    <div id="floorplan-section" className="bg-[#111111] text-white border border-white/10 rounded-2xl shadow-2xl relative overflow-visible flex flex-col justify-start gap-y-0 select-none w-full">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#050505] opacity-85 pointer-events-none rounded-2xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none rounded-2xl" />

      {/* Minimapa s 2D půdorysem — statická v pravém horním rohu sekce */}
      {activeTab !== "Zahrada" && (
        <div className="absolute right-[20px] top-[20px] w-[200px] pointer-events-none hidden md:block z-40">
          <div 
            style={{ 
              width: "200px", 
              height: "150px", 
            }}
            className="w-[200px] h-[150px] bg-[#050914]/90 border border-[#C16B5C]/35 rounded-lg overflow-hidden opacity-85 hover:opacity-100 transition-all shadow-2xl flex items-center justify-center p-1.5 backdrop-blur-md cursor-pointer pointer-events-auto"
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(193,107,92,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(193,107,92,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            <div className="relative w-full h-full max-h-full flex items-center justify-center z-10">
              <svg 
                viewBox="0 0 100 100" 
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                className="select-none cursor-pointer"
              >
                {/* Background CAD frame border lines */}
                <rect x="2" y="2" width="96" height="96" fill="none" stroke="rgba(193, 107, 92, 0.15)" strokeWidth="0.5" />
                <line x1="2" y1="12" x2="98" y2="12" stroke="rgba(193, 107, 92, 0.1)" strokeWidth="0.25" />
                <line x1="2" y1="88" x2="98" y2="88" stroke="rgba(193, 107, 92, 0.1)" strokeWidth="0.25" />
                
                {/* Interactive Rooms shapes */}
                {currentFloor.rooms.map((room) => {
                  const isHovered = hoveredRoomId === room.id;
                  const isSelected = selectedRoomId === room.id;

                  return (
                    <polygon
                      key={`minimap-poly-${room.id}`}
                      points={room.polygon2d}
                      fill={
                        isSelected 
                          ? "rgba(193, 107, 92, 0.35)" 
                          : isHovered 
                            ? "rgba(193, 107, 92, 0.15)" 
                            : "rgba(193, 107, 92, 0.03)"
                      }
                      stroke={
                        isSelected 
                          ? "#C16B5C" 
                          : isHovered 
                            ? "rgba(193,107,92,0.6)" 
                            : "rgba(193, 107, 92, 0.3)"
                      }
                      strokeWidth={isSelected ? "1.5" : "0.75"}
                      strokeDasharray={isSelected ? undefined : "1,1"}
                      onClick={() => handleRoomClick2D(room.id)}
                      onMouseEnter={() => setHoveredRoomId(room.id)}
                      onMouseLeave={() => setHoveredRoomId(null)}
                      className="transition-all duration-150"
                    />
                  );
                })}

                {/* Additional Double Construction Wall Lines */}
                <rect x="5" y="5" width="90" height="90" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                <line x1="32" y1="5" x2="32" y2="95" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                
                {/* Text Labels/IDs inside 2D cells */}
                {currentFloor.rooms.map((room) => {
                  const isSelected = selectedRoomId === room.id;
                  return (
                    <g 
                      key={`minimap-label-${room.id}`} 
                      transform={`translate(${room.center2d.x}, ${room.center2d.y})`}
                      className="pointer-events-none select-none font-sans"
                    >
                      {/* Circular room ID badge */}
                      <circle 
                        r="4.5" 
                        fill={isSelected ? "#C16B5C" : "rgba(5, 9, 20, 0.85)"} 
                        stroke={isSelected ? "#ffffff" : "rgba(193, 107, 92, 0.4)"}
                        strokeWidth="0.5"
                      />
                      <text 
                        y="1.1"
                        fill={isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.8)"} 
                        fontSize="3.8" 
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {room.id}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col justify-start w-full min-h-0 overflow-visible">
        
        {/* Nahoře: Přepínač 1.NP / 2.NP / Zahrada — elegantní, bez zbytečné výšky */}
        <div style={{ height: "60px" }} className="flex items-center justify-center border-b border-white/5 bg-[#0a0a0a]/30 shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-1 bg-[#0a0a0a]/90 p-1 border border-white/10 rounded-full shadow-lg">
            <button
              onClick={() => handleFloorChange("1.NP")}
              className={`px-4 py-2 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "1.NP"
                  ? "bg-[#C16B5C] text-white shadow-md shadow-[#C16B5C]/20"
                  : "text-white/50 hover:text-white"
              }`}
              id="floor-switcher-1.NP"
            >
              1. NP (Přízemí)
            </button>
            <button
              onClick={() => handleFloorChange("2.NP")}
              className={`px-4 py-2 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "2.NP"
                  ? "bg-[#C16B5C] text-white shadow-md shadow-[#C16B5C]/20"
                  : "text-white/50 hover:text-white"
              }`}
              id="floor-switcher-2.NP"
            >
              2. NP (Patro)
            </button>
            <button
              onClick={() => setActiveTab("Zahrada")}
              className={`px-4 py-2 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "Zahrada"
                  ? "bg-[#C16B5C] text-white shadow-md shadow-[#C16B5C]/20"
                  : "text-white/50 hover:text-white"
              }`}
              id="floor-switcher-Zahrada"
            >
              Zahrada
            </button>
          </div>
        </div>

        {/* Společný kontejner pro 3D vizualizaci, detail panel a Minimapu s overflow-visible */}
        <div className="relative flex flex-col w-full overflow-visible">

          {activeTab === "Zahrada" ? (
            <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6 bg-[#0a0a0a]/50 rounded-b-2xl">
              {/* Galerie fotek */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs text-white/50 font-mono mb-1">
                  <span>Fotogalerie exteriéru</span>
                  <span className="text-[#C16B5C] flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" /> Kliknutím na libovolný obrázek jej zvětšíte
                  </span>
                </div>

                {/* První velká fotka */}
                <div 
                  onClick={() => setGardenLightboxPhoto(GARDEN_PHOTOS[0])}
                  className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-xl border border-white/10 group shadow-lg bg-[#0e0e0e] cursor-pointer"
                >
                  <img 
                    src={GARDEN_PHOTOS[0]} 
                    alt="Zahrada - Hlavní pohled" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  {/* Hover Overlay with Zoom Icon */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-[#C16B5C] p-3 rounded-full text-white shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/75 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm text-[10px] text-white/80 font-sans flex items-center gap-1.5 pointer-events-none">
                    <Trees className="w-3.5 h-3.5 text-[#C16B5C]" />
                    <span>Exteriér a okrasná zahrada (Hlavní pohled)</span>
                  </div>
                </div>

                {/* Ostatní fotky ve dvou nebo třech sloupcích */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {GARDEN_PHOTOS.slice(1).map((photo, index) => (
                    <div 
                      key={index} 
                      onClick={() => setGardenLightboxPhoto(photo)}
                      className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 group shadow-md bg-[#0e0e0e] cursor-pointer"
                    >
                      <img 
                        src={photo} 
                        alt={`Zahrada detail ${index + 1}`} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                      {/* Hover Overlay with Zoom Icon */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-[#C16B5C] p-2.5 rounded-full text-white shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                          <Maximize2 className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Krátký popis pod galerií */}
              <div className="bg-[#111111] border border-white/10 p-5 sm:p-6 rounded-xl shadow-inner relative overflow-hidden mt-2">
                <div className="absolute top-0 right-0 w-12 h-12 border-r border-t border-[#C16B5C]/20 rounded-tr-xl pointer-events-none" />
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#C16B5C]/15 border border-[#C16B5C]/30 rounded-xl text-[#C16B5C] shrink-0">
                    <Trees className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold font-serif text-white mb-2 tracking-tight">Obytná zahrada Rezidence Předboj</h4>
                    <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-sans select-text">
                      Udržovaná zahrada o rozloze 678 m² s bazénem 3×7 m vyhřívaným solárními panely, zastřešenou terasou 15 m² a dílnou 11 m². Orientace na jih.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Střed — 3D vizualizace na plnou šířku, bez postranních mezer */}
              <div className="relative bg-[#0a0a0a] flex items-center justify-center overflow-visible w-full h-[45vh] sm:h-[55vh] md:h-[65vh] shrink-0">
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                
                <div className="relative w-full h-full max-h-full flex items-center justify-center p-2 sm:p-4 select-none z-10">
                  <div 
                    style={{ 
                      position: "relative", 
                      width: imageAspect ? undefined : "100%", 
                      height: imageAspect ? undefined : "100%",
                      aspectRatio: imageAspect ? `${imageAspect}` : undefined 
                    }}
                    className="max-w-full max-h-[40vh] sm:max-h-[50vh] md:max-h-[58vh] flex items-center justify-center select-none"
                    onMouseMove={handleMouseMove}
                  >
                    <img 
                      src={currentFloor.imageUrl} 
                      alt={`${currentFloor.level} 3D půdorys`}
                      referrerPolicy="no-referrer"
                      style={{ width: "100%", height: "100%", display: "block", mixBlendMode: "multiply" }}
                      className="select-none drop-shadow-[0_12px_22px_rgba(0,0,0,0.6)]"
                      onLoad={(e) => {
                        const img = e.currentTarget;
                        if (img.naturalWidth && img.naturalHeight) {
                          setImageAspect(img.naturalWidth / img.naturalHeight);
                        }
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://picsum.photos/seed/residence-3d-fallback-${activeFloorIdx}/640/480`;
                      }}
                    />

                    {/* Circular clickable buttons exactly over the numbers in the image */}
                    {currentFloor.rooms.map((room) => {
                      const pos = BUTTON_POSITIONS[currentFloor.level]?.[room.id];
                      if (!pos) return null;

                      const isSelected = selectedRoomId === room.id;

                      return (
                        <button
                          key={`btn-3d-${room.id}`}
                          onClick={() => {
                            setSelectedRoomId(room.id);
                          }}
                          onMouseEnter={() => setHoveredRoomId(room.id)}
                          onMouseLeave={() => setHoveredRoomId(null)}
                          title={room.name}
                          style={{
                            position: "absolute",
                            left: pos.left,
                            top: pos.top,
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 30,
                          }}
                          className={`transition-all duration-200 outline-none cursor-pointer border-2 ${
                            isSelected
                              ? "border-[#C16B5C] bg-[#C16B5C]/25 shadow-[0_0_15px_rgba(193,107,92,0.6)]"
                              : "border-white/40 bg-transparent hover:border-[#C16B5C] hover:bg-[#C16B5C]/15 hover:shadow-[0_0_12px_rgba(193,107,92,0.5)]"
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

               {/* Detail panel pod vizualizací — foto placeholder vlevo, text vpravo, s nulovými mezerami a větším prostorem */}
              <div id="detail-panel" className="bg-[#111111] border-t border-white/10 flex flex-col md:flex-row items-stretch w-full overflow-hidden shrink-0 rounded-b-2xl">
                
                {/* Levá část: Velká fotka / placeholder — 45% šířky na desktopu */}
                <div className="md:w-[45%] w-full h-[240px] sm:h-[280px] md:h-[320px] bg-[#090909] relative flex flex-col items-center justify-center text-center select-none border-b md:border-b-0 md:border-r border-white/5 shadow-inner overflow-hidden">
                  {selectedRoom.photoUrl ? (
                    <div className="relative w-full h-full group">
                      <img 
                        src={selectedRoom.photoUrl} 
                        alt={`Fotografie místnosti ${selectedRoom.name}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                        onClick={() => setLightboxRoom(selectedRoom)}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://picsum.photos/seed/room-detail-${selectedRoom.id}/640/480`;
                        }}
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-left">
                        <span className="text-[10px] font-mono text-white/70">
                          Reálné foto • Klikněte pro zvětšení
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                      <Camera className="w-8 h-8 text-[#C16B5C]/55 mb-2 shrink-0 animate-pulse" />
                      <span className="text-xs font-sans font-bold uppercase tracking-widest text-white/50">
                        Foto bude doplněno
                      </span>
                      <span className="text-[10px] font-mono text-white/30 mt-1">
                        Podlaží: {currentFloor.level} • Místnost {selectedRoom.id}
                      </span>
                      {/* foto: [selectedRoom.name] */}
                      {/* foto: [název místnosti] */}
                      <div dangerouslySetInnerHTML={{ __html: `<!-- foto: [${selectedRoom.name}] -->` }} />
                    </div>
                  )}
                </div>

                {/* Pravá část: Textové informace — 55% šířky na desktopu */}
                <div className="md:w-[55%] w-full p-5 sm:p-6 md:p-8 flex flex-col justify-between relative bg-gradient-to-br from-white/[0.01] to-transparent">
                  <div className="absolute top-0 right-0 w-12 h-12 border-r border-t border-[#C16B5C]/20 rounded-tr-xl pointer-events-none" />
                  
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      {/* Název místnosti velkým písmem a výměra */}
                      <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 bg-[#C16B5C]/15 border border-[#C16B5C]/30 rounded-xl text-[#C16B5C] shrink-0">
                            {getRoomIcon(selectedRoom.iconName, "w-5 h-5")}
                          </div>
                          <h4 className="text-lg sm:text-2xl font-bold font-serif text-white tracking-tight truncate">
                            {selectedRoom.name}
                          </h4>
                        </div>
                        <div className="shrink-0 font-mono bg-[#C16B5C]/15 border border-[#C16B5C]/30 px-3 py-1 rounded-lg text-xs md:text-sm text-[#C16B5C] font-extrabold shadow-sm">
                          {selectedRoom.area}
                        </div>
                      </div>

                      {/* Popis místnosti bez oříznutí */}
                      <div className="mt-4 text-white/80 text-xs sm:text-sm leading-relaxed select-text font-sans font-normal">
                        <p className="line-clamp-4 md:line-clamp-none">
                          {selectedRoom.description}
                        </p>
                      </div>
                    </div>

                    {/* Výpis standardů pro prémiový dojem */}
                    <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[8px] font-mono tracking-widest text-[#C16B5C] uppercase font-bold mb-1">Vybavení a technika</span>
                        <ul className="text-[10px] text-white/50 space-y-0.5 list-disc pl-3">
                          {selectedRoom.equipment.slice(0, 2).map((eq, i) => (
                            <li key={i} className="truncate">{eq}</li>
                          ))}
                          {selectedRoom.equipment.length === 0 && <li className="italic">Standardní vybavení</li>}
                        </ul>
                      </div>
                      <div>
                        <span className="block text-[8px] font-mono tracking-widest text-[#C16B5C] uppercase font-bold mb-1">Materiály a standardy</span>
                        <ul className="text-[10px] text-white/50 space-y-0.5 list-disc pl-3">
                          {selectedRoom.materials.slice(0, 2).map((m, i) => (
                            <li key={i} className="truncate">{m}</li>
                          ))}
                          {selectedRoom.materials.length === 0 && <li className="italic">Prémiové materiály</li>}
                        </ul>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </>
          )}



        </div>

      </div>

      {/* LIGHTBOX POPUP MODAL (For Photography Rendering) */}
      <AnimatePresence>
        {lightboxRoom && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            onClick={() => setLightboxRoom(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button "X" */}
              <button 
                onClick={() => setLightboxRoom(null)}
                className="absolute top-4 right-4 z-40 p-2 rounded-full bg-black/60 hover:bg-[#C16B5C] text-white border border-white/5 transition-all cursor-pointer shadow-lg"
                title="Zavřít galerii"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Box (Room Name + m²) */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between gap-6 bg-gradient-to-r from-black/50 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#C16B5C]/20 border border-[#C16B5C]/35 rounded-lg text-[#C16B5C]">
                    {getRoomIcon(lightboxRoom.iconName, "w-5 h-5")}
                  </div>
                  <div>
                    <span className="text-[9px] font-mono tracking-widest text-[#C16B5C] uppercase block font-bold">Fotogalerie k nahlédnutí</span>
                    <h3 className="text-lg sm:text-xl font-bold font-serif text-white tracking-tight mt-0.5">{lightboxRoom.name}</h3>
                  </div>
                </div>
                <div className="text-right font-mono bg-white/5 border border-white/10 rounded-lg py-1 px-3">
                  <span className="block text-[8px] text-white/50 uppercase">Plánská plocha</span>
                  <span className="text-sm font-bold text-[#C16B5C]">{lightboxRoom.area}</span>
                </div>
              </div>

              {/* Large Content Graphic */}
              <div className="p-6">
                {lightboxRoom.photoUrl ? (
                  <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black rounded-lg overflow-hidden border border-white/5 group shadow-inner">
                    <img 
                      src={lightboxRoom.photoUrl} 
                      alt={`Fotografie místnosti ${lightboxRoom.name}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://picsum.photos/seed/room-${lightboxRoom.id}/800/450`;
                      }}
                    />
                    <div className="absolute bottom-3 left-3 bg-black/75 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm text-[10px] text-white/80 font-sans flex items-center gap-1.5 pointer-events-none">
                      <Camera className="w-3.5 h-3.5 text-[#C16B5C]" />
                      <span>Reálný snímek interiéru Rezidence Předboj</span>
                    </div>
                  </div>
                ) : (
                  // Dark structured artistic placeholder with camera icon
                  <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-[#090909] rounded-lg border border-white/5 flex flex-col items-center justify-center text-center p-6 space-y-3 group shadow-inner">
                    {/* Architectural blueprint guidelines overlay in placeholder */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none rounded-lg" />
                    
                    <div className="p-4 bg-white/5 border border-white/10 rounded-full text-white/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#C16B5C]/10 group-hover:text-[#C16B5C] group-hover:border-[#C16B5C]/25">
                      <Camera className="w-8 h-8" />
                    </div>
                    
                    <div className="space-y-1 max-w-sm">
                      <h4 className="text-sm font-semibold text-white tracking-wide uppercase font-sans">
                        Snímek bude doplněn
                      </h4>
                      <p className="text-xs text-white/40 font-normal leading-relaxed">
                        Fotografická dokumentace pro prostor "{lightboxRoom.name}" se v současné době zpracovává do prodejní brožury.
                      </p>
                    </div>

                    <span className="text-[9px] font-mono uppercase bg-white/5 border border-white/10 text-white/50 rounded px-2.5 py-1 tracking-wider">
                      kódový odkaz: {`InteractiveRoom.photoUrl`}
                    </span>
                  </div>
                )}

                {/* Lightbox Footer Info */}
                <div className="mt-4 text-xs text-white/60 font-sans leading-relaxed bg-[#050505]/40 p-3 rounded-lg border border-white/5">
                  <p>{lightboxRoom.description}</p>
                </div>
              </div>

              {/* Action buttons inside Lighbox */}
              <div className="p-4 border-t border-white/10 bg-[#0c0c0c] flex items-center justify-end gap-3 rounded-b-2xl">
                <button 
                  onClick={() => setLightboxRoom(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg text-xs font-semibold cursor-pointer border border-white/5 transition-all"
                >
                  Zavřít náhled
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GARDEN PHOTOGRAPHY LIGHTBOX */}
      <AnimatePresence>
        {gardenLightboxPhoto && (() => {
          const currentIdx = GARDEN_PHOTOS.indexOf(gardenLightboxPhoto);
          return (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
              onClick={() => setGardenLightboxPhoto(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button "X" */}
                <button 
                  onClick={() => setGardenLightboxPhoto(null)}
                  className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/60 hover:bg-[#C16B5C] text-white border border-white/5 transition-all cursor-pointer shadow-lg"
                  title="Zavřít"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header Box (Title + index) */}
                <div className="p-5 border-b border-white/10 flex items-center justify-between gap-6 bg-gradient-to-r from-black/50 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#C16B5C]/20 border border-[#C16B5C]/35 rounded-lg text-[#C16B5C]">
                      <Trees className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono tracking-widest text-[#C16B5C] uppercase block font-bold">Zahrada a exteriér</span>
                      <h3 className="text-lg sm:text-xl font-bold font-serif text-white tracking-tight mt-0.5">Rezidence Předboj</h3>
                    </div>
                  </div>
                  <div className="text-right font-mono bg-white/5 border border-white/10 rounded-lg py-1.5 px-3">
                    <span className="block text-[8px] text-white/50 uppercase">Snímek</span>
                    <span className="text-sm font-bold text-[#C16B5C]">{currentIdx + 1} / {GARDEN_PHOTOS.length}</span>
                  </div>
                </div>

                {/* Large Content Graphic with interactive side controls */}
                <div className="p-6 relative">
                  <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black rounded-lg overflow-hidden border border-white/5 shadow-inner flex items-center justify-center">
                    <img 
                      src={gardenLightboxPhoto} 
                      alt={`Zahrada detail ${currentIdx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />

                    {/* Previous button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const prevIdx = (currentIdx - 1 + GARDEN_PHOTOS.length) % GARDEN_PHOTOS.length;
                        setGardenLightboxPhoto(GARDEN_PHOTOS[prevIdx]);
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-[#C16B5C] text-white border border-white/5 hover:scale-105 transition-all cursor-pointer shadow-lg z-40"
                      title="Předchozí snímek"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Next button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const nextIdx = (currentIdx + 1) % GARDEN_PHOTOS.length;
                        setGardenLightboxPhoto(GARDEN_PHOTOS[nextIdx]);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-[#C16B5C] text-white border border-white/5 hover:scale-105 transition-all cursor-pointer shadow-lg z-40"
                      title="Další snímek"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="absolute bottom-3 left-3 bg-black/75 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm text-[10px] text-white/80 font-sans flex items-center gap-1.5 pointer-events-none">
                      <Trees className="w-3.5 h-3.5 text-[#C16B5C]" />
                      <span>Reálný exteriérový snímek vily v Předboji</span>
                    </div>
                  </div>

                  {/* Lightbox Footer Info */}
                  <div className="mt-4 text-xs text-white/60 font-sans leading-relaxed bg-[#050505]/40 p-3 rounded-lg border border-white/5">
                    <p>Udržovaná zahrada o celkové výměře 678 m² s bazénem o velikosti 3×7 m s komfortním solárním vyhříváním, zastřešenou terasou o rozloze 15 m² a samostatným zahradním domkem/dílnou o výměře 11 m².</p>
                  </div>
                </div>

                {/* Action buttons inside Lightbox */}
                <div className="p-4 border-t border-white/10 bg-[#0c0c0c] flex items-center justify-end gap-3 rounded-b-2xl">
                  <button 
                    onClick={() => setGardenLightboxPhoto(null)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg text-xs font-semibold cursor-pointer border border-white/5 transition-all"
                  >
                    Zavřít náhled
                  </button>
                </div>

              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
