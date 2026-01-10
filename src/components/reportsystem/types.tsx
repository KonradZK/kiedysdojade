export type Icon = {
  id: string;
  label: string;
  icon: string;
  // icon: React.ElementType;
};

export const IconSet: Icon[] = [
  { id: "inspector", label: "Kanar", icon: "👮" },
  { id: "malfunction", label: "Awaria", icon: "🚧" },
  { id: "accident", label: "Wypadek", icon: "💥" },
  { id: "delay", label: "Opóźnienie", icon: "🕒" },
];

export interface Alert {
  id: string;
  lat: number;
  lon: number;
  line: string;
  category: "inspector" | "malfunction" | "accident" | "delay";
  score: number;
  since: string;
  remaning: number;
}
