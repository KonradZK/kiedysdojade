import { useCallback, useMemo, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import type { DragEndEvent, LatLng, LatLngExpression } from "leaflet";

// Define the component's new props
interface DraggableMarkerProps {
  position: LatLngExpression;
  setPosition: (position: LatLng) => void;
}

function DraggableMarker({ position, setPosition }: DraggableMarkerProps) {
  // Draggable state can remain internal to this component
  const [draggable, setDraggable] = useState(false);

  const eventHandlers = useMemo(
    () => ({
      dragend(e: DragEndEvent) {
        // Use the setPosition function passed from the parent
        setPosition(e.target.getLatLng());
      },
    }),
    [setPosition] // Add setPosition as a dependency
  );

  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d);
  }, []);

  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      // The ref is no longer needed
    >
      <Popup minWidth={90}>
        <span onClick={toggleDraggable} style={{ cursor: "pointer" }}>
          {draggable
            ? "Marker is draggable"
            : "Click here to make marker draggable"}
        </span>
      </Popup>
    </Marker>
  );
}

export { DraggableMarker };
