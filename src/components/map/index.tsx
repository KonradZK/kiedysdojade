import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useMemo, useEffect, useRef } from "react";
import type { Stop, StopGroup, LineInfo } from "../sidebar/types";
import { CustomMarkers, SelectedStopMarkers } from "./marker";
import { Polylines } from "./polyline";

interface MapProps {
  stops: Array<Stop>;
  lines: Array<LineInfo>;
  selectedStart: StopGroup | null;
  selectedEnd: StopGroup | null;
  children?: React.ReactNode;
}

const DEFAULT_CENTER: [number, number] = [52.4064, 16.9252];

// Component to handle map focus when a stop is selected
const MapFocusHandler = ({
  selectedStart,
  selectedEnd,
  hasRoute,
}: {
  selectedStart: StopGroup | null;
  selectedEnd: StopGroup | null;
  hasRoute: boolean;
}) => {
  const map = useMap();
  const lastFocusRef = useRef<{
    start: StopGroup | null;
    end: StopGroup | null;
  }>({
    start: null,
    end: null,
  });

  useEffect(() => {
    // Only focus on selected stops if no route is displayed yet
    if (hasRoute) return;

    // Check if selection has changed
    const startChanged = lastFocusRef.current.start !== selectedStart;
    const endChanged = lastFocusRef.current.end !== selectedEnd;

    // If both start and end are selected, focus on the midpoint between them
    if (selectedStart && selectedEnd) {
      if (startChanged || endChanged) {
        const midLat = (selectedStart.lat + selectedEnd.lat) / 2;
        const midLon = (selectedStart.lon + selectedEnd.lon) / 2;

        // Calculate optimal zoom to fit both markers
        const latDiff = Math.abs(selectedStart.lat - selectedEnd.lat);
        const lonDiff = Math.abs(selectedStart.lon - selectedEnd.lon);
        const maxDiff = Math.max(latDiff, lonDiff);

        // Simple heuristic: smaller difference = higher zoom
        let zoom = 15;
        if (maxDiff > 0.05) zoom = 13;
        if (maxDiff > 0.1) zoom = 12;
        if (maxDiff > 0.2) zoom = 11;

        map.flyTo([midLat, midLon], zoom, {
          duration: 0.5,
        });

        lastFocusRef.current = { start: selectedStart, end: selectedEnd };
      }
      // Don't change focus after this, user has control
    }
    // If only start is selected, focus on start
    else if (selectedStart && !selectedEnd) {
      if (startChanged) {
        map.flyTo([selectedStart.lat, selectedStart.lon], 15, {
          duration: 0.5,
        });
        lastFocusRef.current = { start: selectedStart, end: null };
      }
    }
    // If nothing is selected, reset
    else if (!selectedStart && !selectedEnd) {
      lastFocusRef.current = { start: null, end: null };
    }
  }, [selectedStart, selectedEnd, hasRoute, map]);

  return null;
};

const Map = ({
  stops,
  lines,
  selectedStart,
  selectedEnd,
  children,
}: MapProps) => {
  const hasRoute = stops.length > 0;

  const route = useMemo(() => {
    const defaultPositions = stops.map((stop) => ({
      lat: stop.lat,
      lng: stop.lon,
    }));

    const linesToRender = lines.length > 0 ? lines : [];

    return (
      <>
        <CustomMarkers stops={stops} />
        {linesToRender.length > 0 ? (
          linesToRender.map((line, idx) => {
            // Special handling for WALK segments: draw a straight dotted white line between start and end codes
            if (line.lineNumber === "WALK") {
              const start = stops.find((s) => s.code === line.startCode);
              const end = stops.find((s) => s.code === line.endCode);
              const walkPositions =
                start && end
                  ? [
                      { lat: start.lat, lng: start.lon },
                      { lat: end.lat, lng: end.lon },
                    ]
                  : [];
              return (
                <Polylines
                  key={`${line.lineNumber}-${idx}`}
                  positions={walkPositions.length > 0 ? walkPositions : defaultPositions}
                  color="#ffffff"
                  weight={3}
                  dashArray="2 10"
                />
              );
            }
            const positions =
              line.shape.length > 0
                ? line.shape.map((p) => ({ lat: p.lat, lng: p.lon }))
                : defaultPositions;
            const color = line.colorHex || "#3388ff";
            return (
              <Polylines
                key={`${line.lineNumber}-${idx}`}
                positions={positions}
                color={color}
              />
            );
          })
        ) : (
          <Polylines positions={defaultPositions} />
        )}
      </>
    );
  }, [stops, lines]);

  return (
    <div className="absolute inset-0">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={13}
        className="w-full h-full z-0"
        style={{ willChange: "auto" }}
        zoomControl={false}
      >
        <MapFocusHandler
          selectedStart={selectedStart}
          selectedEnd={selectedEnd}
          hasRoute={hasRoute}
        />
        <SelectedStopMarkers
          selectedStart={selectedStart}
          selectedEnd={selectedEnd}
        />
        {route}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
      </MapContainer>
    </div>
  );
};

export default Map;
