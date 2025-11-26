import { Polyline } from "react-leaflet";

type PolylineProps = {
  positions: { lat: number; lng: number }[];
};

function Polylines({ positions }: PolylineProps) {
  return (
    <Polyline
      pathOptions={{
        color: "#3388ff",
        weight: 5,
        opacity: 0.8,
        lineCap: "round",
        lineJoin: "round",
      }}
      positions={positions}
    />
  );
}

export { Polylines };
