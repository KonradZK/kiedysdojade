import { Marker } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { divIcon } from "leaflet";

// Define a more sophisticated custom icon using HTML and CSS
const PinIcon = divIcon({
  html: `
    <div style="
      background: linear-gradient(135deg, #333 0%, #000 100%);
      width: 30px;
      height: 30px;
      border-radius: 50% 50% 50% 0; /* Creates a teardrop shape */
      transform: rotate(-45deg);
      border: 2px solid #fff; /* White border */
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      position: relative;
    ">
      <div style="
        background: #fff;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        transform: rotate(45deg); /* Counter-rotate inner circle */
      "></div>
    </div>
  `,
  className: "sleek-marker-icon", // Keep a class for potential external CSS overrides
  iconSize: [30, 40], // Adjust size for the teardrop
  iconAnchor: [15, 40], // Anchor at the tip of the teardrop
  popupAnchor: [0, -40], // Position popup above the tip
});

// Define the props interface
interface MarkersProps {
  position: LatLngExpression;
}

/**
 * A custom-styled marker component that displays a popup on click.
 */
function Markers({ position }: MarkersProps) {
  return <Marker position={position} icon={PinIcon} />;
}

export { Markers };
