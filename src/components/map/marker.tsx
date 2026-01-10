import { Marker } from "react-leaflet";
import { divIcon } from "leaflet";

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

const IntermediateStopIcon = divIcon({
  html: `
    <div style="
      width: 16px;
      height: 16px;
      background-color: #ffffff;
      border: 3px solid #3b82f6; /* blue-500 */
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    "></div>
  `,
  className: "intermediate-stop-icon",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -10],
});

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

interface MarkersProps {
  positions: { lat: number; lng: number }[];
  isAlert: boolean;
}

const Markers = ({ positions, isAlert }: MarkersProps) => {
  return (
    <>
      {positions.map((position, index) => {
        const isFirst = index === 0;
        const isLast = index === positions.length - 1;

        const icon = !isAlert
          ? isFirst || isLast
            ? PinIcon
            : IntermediateStopIcon
          : AlertIcon;

        return (
          <Marker
            key={`${position.lat}-${position.lng}-${index}`}
            position={position}
            icon={icon}
          />
        );
      })}
    </>
  );
};

export { Markers };
