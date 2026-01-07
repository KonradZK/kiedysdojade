import { Polyline } from "react-leaflet";

type PolylineProps = {
  positions: { lat: number; lng: number }[];
  color?: string;
  weight?: number;
};

function Polylines({ positions, color = "#3388ff", weight = 5 }: PolylineProps) {
  return (
    <Polyline
      pathOptions={{
        color,
        weight,
        opacity: 0.8,
        lineCap: "round",
        lineJoin: "round",
      }}
      positions={positions}
    />
  );
}

export { Polylines };
