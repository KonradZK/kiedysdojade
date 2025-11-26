import { MapPin } from "lucide-react";
import type { Stop } from "@/types/stop";



interface RouteDetailsProps {
  routeStops: Stop[];
}

const RouteDetails = ({ routeStops }: RouteDetailsProps) => {
  if (!routeStops.length) {
    return (
      <div className="text-sm text-muted-foreground mt-2">
        Wybierz trasę, aby zobaczyć szczegóły.
      </div>
    );
  }

  return (
    <div className="max-h-64 overflow-y-auto mt-2">
      <h2 className="font-semibold text-lg mb-3">Szczegóły trasy</h2>
      <ul className="relative border-l border-gray-300 dark:border-gray-600 pl-6">
        {routeStops.map((stop, i) => (
          <li key={i} className="mb-4 relative">
            <span className="absolute -left-[11px] top-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow"></span>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="font-medium">{stop.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{stop.code}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RouteDetails;
