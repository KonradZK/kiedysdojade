import type { Groupnames, Stop } from "@/types/stop";
import { Card, CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
  ItemActions,
} from "../ui/item";
import { Label } from "../ui/label";
import type { RouteProps, Line } from "@/mocked/availableRoutes";

interface AvailableRoutesProps {
  stops: Array<Groupnames>;
  routes: Array<RouteProps>;
  onSelect: (stop_code: string) => void;
  onHoverRoute: (stops: Array<Stop>) => void;
}

const AvailableRoutes: React.FC<AvailableRoutesProps> = ({
  stops,
  routes,
  onSelect,
  onHoverRoute,
}) => {

  return (
    <div className="flex flex-col gap-2 h-full">
      <Card className="h-full border-0 shadow-none">
        <CardContent className="p-0 h-full">
          <ScrollArea className="h-full pr-4">
            <ul className="flex flex-col gap-2 pb-4">
              {routes.map((route, idx) => (
                <li key={idx}>
                  <Item
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => {
                      onSelect(route.id);
                      onHoverRoute(route.stops || []);
                    }}
                    onMouseEnter={() => {
                      onHoverRoute(route.stops || []);
                    }}
                    onMouseLeave={() => {
                      onHoverRoute([]);
                    }}
                  >
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

                    <ItemActions>
                      <Label className="text-muted-foreground text-sm font-medium whitespace-nowrap">
                        {route.routeTime} min
                      </Label>
                    </ItemActions>
                  </Item>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailableRoutes;
