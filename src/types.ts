export interface RoomInfo {
  id: number;
  name: string;
  area: string;
  description: string;
  color: string;
  labelPosition: { x: number; y: number }; // Percentage coordinate for the plan label
  iconName: string;
}

export interface FloorInfo {
  level: string; // "1.NP" or "2.NP"
  title: string;
  totalArea: string;
  description: string;
  rooms: RoomInfo[];
  diagramPath?: string;
}

export interface PropertyParameter {
  label: string;
  value: string;
  category: "základní" | "výměry" | "technické" | "vybavení" | "lokalita";
  icon: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  src: string;
  category: "all" | "exterior" | "interior" | "floorplan";
  description?: string;
}
