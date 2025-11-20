//
// map working with draggableMarker
import L from "Leaflet";
import { useState } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import type { LatLng } from "leaflet";
import { DraggableMarker } from "./draggableMarker";

// The initial center of the map
const center = {
  lat: 52.3906,
  lng: 16.9198,
};

// --- Helper Component ---
// This component listens for map clicks and calls setPosition
function MapClickHandler({
  setPosition,
}: {
  setPosition: (pos: LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      // On click, update the parent's state
      setPosition(e.latlng);
    },
  });
  return null; // This component doesn't render any-thing
}

// --- Main Map Component ---
function MyMap() {
  // This is the state we "lifted up"
  const [position, setPosition] = useState<LatLng>(
    new L.LatLng(center.lat, center.lng)
  );

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* The helper component that handles map clicks */}
      <MapClickHandler setPosition={setPosition} />

      {/* Your marker, now controlled by the parent's state */}
      <DraggableMarker position={position} setPosition={setPosition} />
    </MapContainer>
  );
}

export default MyMap;
