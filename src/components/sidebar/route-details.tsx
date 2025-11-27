import type { Stop } from "@/types/stop";
import type { RouteProps, Line } from "@/mocked/availableRoutes";
import { Card, CardContent } from "../ui/card";
import { Item, ItemContent, ItemTitle, ItemDescription } from "../ui/item";
import { Label } from "../ui/label";

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
                  <div className="flex items-center gap-2">
                    {route.lines.map((line: Line, index: number) => (
                      <span
                        key={index}
                        className="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-bold text-sm leading-none"
                      >
                        {line.lineNumber}
                      </span>
                    ))}
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
        <ul className="relative border-l border-gray-300 dark:border-gray-600 pl-6 ml-3">
          {routeStops.map((stop, i) => (
            <li key={i} className="mb-6 relative last:mb-0">
              <span className="absolute -left-[31px] top-1 w-4 h-4 bg-background border-2 border-primary rounded-full z-10"></span>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{stop.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{stop.code}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RouteDetails;
