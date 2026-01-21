import type { Stop, RouteProps, LineInfo, PathElement } from "./types";
import { Card, CardContent } from "../ui/card";
import { Item, ItemContent, ItemTitle, ItemDescription } from "../ui/item";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { MapPin, Footprints, Clock } from "lucide-react";

interface RouteDetailsProps {
  routeStops: Stop[];
  route?: RouteProps;
}

const RouteDetails = ({ routeStops, route }: RouteDetailsProps) => {
  if (!routeStops.length) {
    return (
      <div className="text-sm text-muted-foreground mt-2">
        Wybierz trasę, aby zobaczyć szczegóły.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="font-semibold text-lg">Szczegóły trasy</h2>
      </div>

      {route && (
        <Card className="mb-4">
          <CardContent className="p-0">
            <Item className="border-none shadow-none">
              {/* Left: Status & TimeToGo */}
              <div className="flex flex-col items-center justify-center min-w-[60px] mr-4">
                <Label className="text-xs text-muted-foreground mb-1 font-medium">
                  {route.status}
                </Label>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold tracking-tight leading-none">
                    {route.timeToGo}
                  </span>
                  {route.timeToGo.length < 3 && (
                    <span className="text-xs text-muted-foreground ml-0.5 font-medium">
                      min
                    </span>
                  )}
                </div>
              </div>

              <ItemContent>
                <ItemTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    {route.lines.map((line: LineInfo, index: number) => {
                      const color = line.colorHex;
                      const textColor = line.textColorHex;
                      
                      if (line.lineNumber === "WALK") {
                        return (
                          <div
                            key={index}
                            className="rounded px-1.5 py-0.5 font-bold text-sm leading-none border border-border flex items-center gap-1"
                            title="Przejście pieszo"
                          >
                            <Footprints className="w-4 h-4" />
                          </div>
                        );
                      }
                      
                      const style: React.CSSProperties = {
                        backgroundColor: color ? `${color}22` : undefined,
                        color: textColor || color || undefined,
                        borderColor: color || undefined,
                      };
                      return (
                        <span
                          key={index}
                          style={style}
                          className="rounded px-1.5 py-0.5 font-bold text-sm leading-none border"
                        >
                          {line.lineNumber}
                        </span>
                      );
                    })}
                  </div>
                </ItemTitle>
                <ItemDescription>
                  <span className="flex items-center gap-2 text-xs mt-1">
                    <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      {route.departureTime}
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                      {route.routeTime} min
                    </span>
                    <span className="bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      {route.arriveTime}
                    </span>
                  </span>
                </ItemDescription>
              </ItemContent>
            </Item>
          </CardContent>
        </Card>
      )}
      <div className="flex-1 overflow-y-auto pr-2">
        <ScrollArea className="h-60">
        <ul className="relative border-l border-gray-300 dark:border-gray-600 pl-6 ml-3">
          {(route?.path || routeStops).map((item, i) => {
            const stop = 'stop' in item ? item.stop : item;
            const pathElement = 'stop' in item ? (item as PathElement) : null;
            const isFirstOrLast = i === 0 || i === (route?.path || routeStops).length - 1;
            
            return (
              <li key={i} className="mb-6 relative last:mb-0">
                {isFirstOrLast ? (
                  <div className="absolute -left-[35px] top-0 z-10 bg-background">
                    <MapPin className="w-6 h-6 text-primary fill-primary/20" />
                  </div>
                ) : (
                  <span className="absolute -left-[31px] top-1 w-4 h-4 bg-background border-2 border-primary rounded-full z-10"></span>
                )}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{stop.name}</span>
                  </div>
                  {pathElement && (
                    <div className="flex items-center gap-2 mt-1">
                      {pathElement.arrival_time && i !== 0 && (
                        <span className="text-xs bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {pathElement.arrival_time.substring(0, 5)}
                        </span>
                      )}
                      {pathElement.departure_time && i !== (route?.path || routeStops).length - 1 && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {pathElement.departure_time.substring(0, 5)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        </ScrollArea>
      </div>
    </div>
  );
};

export default RouteDetails;
