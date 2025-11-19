import { Polyline } from "react-leaflet";

import type { LatLngExpression } from "leaflet";

interface PolylinesProps {
  positions: LatLngExpression[][];
}

function Polylines({ positions }: PolylinesProps) {
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
