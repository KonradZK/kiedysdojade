import { divIcon } from "leaflet";
import { Marker } from "react-leaflet";

const AlertIcon = divIcon({
  html: `
    <div style="
      width: 16px;
      height: 16px;
      background-color: red;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    "></div>
  `,
  className: "intermediate-stop-icon",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -10],
});

function PointMarker({ position }: { position: { lat: number; lng: number } }) {
    return (
        <Marker
            position={position}
            icon={AlertIcon}
        />
    );
}

export { PointMarker };
