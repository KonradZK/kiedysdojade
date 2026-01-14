import { Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import type { Stop, StopGroup } from "../sidebar/types";

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

const createLabeledMarkerIcon = (label: string, color: string) =>
  divIcon({
    html: `
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div style="
        background-color: ${color};
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        margin-bottom: 4px;
      ">${label}</div>
      <div style="
        width: 24px;
        height: 24px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    </div>
  `,
    className: "labeled-marker-icon",
    iconSize: [24, 24],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
  });

const StartIcon = createLabeledMarkerIcon("Początek", "#22c55e"); // green-500
const EndIcon = createLabeledMarkerIcon("Koniec", "#ef4444"); // red-500

const CustomMarkers = ({
  stops,
}: {
  stops?: Stop[];
}) => {
  const safeStops = Array.isArray(stops) ? stops : [];
  return (
    <>
      {safeStops.map((stop, index) => {
        const isFirst = index === 0;
        const isLast = index === safeStops.length - 1;

        if (isFirst || isLast) return null;

        return (
          <Marker
            key={`${stop.lat}-${stop.lon}-${index}`}
            position={{ lat: stop.lat, lng: stop.lon }}
            icon={IntermediateStopIcon}
          >
            <Popup>
              {stop.name}
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

const SelectedStopMarkers = ({
  selectedStart,
  selectedEnd,
}: {
  selectedStart: StopGroup | null;
  selectedEnd: StopGroup | null;
}) => {
  return (
    <>
      {selectedStart && (
        <Marker
          key={`start-${selectedStart.group_code}`}
          position={[selectedStart.lat, selectedStart.lon]}
          icon={StartIcon}
        />
      )}
      {selectedEnd && (
        <Marker
          key={`end-${selectedEnd.group_code}`}
          position={[selectedEnd.lat, selectedEnd.lon]}
          icon={EndIcon}
        />
      )}
    </>
  );
};

export { CustomMarkers, SelectedStopMarkers };
