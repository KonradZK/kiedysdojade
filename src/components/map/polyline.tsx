import { Polyline } from "react-leaflet";

type PolylineProps = {
  positions: { lat: number; lng: number }[];
  color?: string;
  weight?: number;
  dashArray?: string;
};

function Polylines({ positions, color = "#3388ff", weight = 5, dashArray }: PolylineProps) {
  return (
    <Polyline
      pathOptions={{
        color,
        weight,
        opacity: 0.8,
        lineCap: "round",
        lineJoin: "round",
        dashArray,
      }}
      positions={positions}
    />
  );
}

export { Polylines };
