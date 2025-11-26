import { MapContainer, TileLayer } from "react-leaflet";
import { useMemo } from "react";
import type { Stop } from "@/types/stop";
import { CustomMarkers } from "./marker";
import { Polylines } from "./polyline";

interface MapProps {
  stops: Array<Stop>;
}

const DEFAULT_CENTER: [number, number] = [52.4064, 16.9252];

const Map = ({ stops }: MapProps) => {
  const route = useMemo(() => {
    const positions = stops.map((stop) => ({ lat: stop.lat, lng: stop.lon }));
    return (
      <>
        <CustomMarkers positions={positions} />
        <Polylines positions={positions} />
      </>
    );
  }, [stops]);

  return (
    <div className="absolute inset-0">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={13}
        className="w-full h-full z-0"
        style={{ willChange: "auto" }}
        zoomControl={false}
      >
        {route}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
};

export default Map;
