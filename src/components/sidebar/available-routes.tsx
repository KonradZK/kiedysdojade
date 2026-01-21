import React from "react";
import type { RouteProps } from "./types";
import { Card, CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "../ui/item";
import { Label } from "../ui/label";
import { Clock, Footprints } from "lucide-react";

interface AvailableRoutesProps {
  routes: Array<RouteProps>;
  onSelect: (stop_code: string) => void;
  onHoverRoute: (route: RouteProps | null) => void;
  isLoading?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

const AvailableRoutes: React.FC<AvailableRoutesProps> = ({
  routes,
  onSelect,
  onHoverRoute,
  isLoading = false,
  onLoadMore,
  isLoadingMore = false,
}) => {
  return (
    <div className="flex flex-col gap-2 h-full">
      <Card className="h-full border-0 shadow-none">
        <CardContent className="p-0 h-full">
          <ScrollArea className="h-96 pr-4">
            <ul className="flex flex-col gap-2 pb-4">
              {isLoading && routes.length === 0 ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <li key={idx}>
                      <Card className="border-0 shadow-none">
                        <CardContent className="p-0">
                           <div className="flex items-center p-4 space-x-4">
                             <div className="space-y-2">
                               <Skeleton className="h-4 w-[60px]" />
                               <Skeleton className="h-8 w-[60px]" />
                             </div>
                             <div className="flex-1 space-y-2">
                               <Skeleton className="h-4 w-full" />
                               <Skeleton className="h-4 w-3/4" />
                             </div>
                           </div>
                        </CardContent>
                      </Card>
                    </li>
                  ))
              ) : (
                routes.map((route, idx) => (
                <li key={idx}>
                  <Item
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => {
                      onSelect(route.id);
                      onHoverRoute(route);
                    }}
                    onMouseEnter={() => {
                      onHoverRoute(route);
                    }}
                    onMouseLeave={() => {
                      onHoverRoute(null);
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
                        <div className="flex items-center gap-2 flex-wrap">
                          {route.lines.map((line, index) => {
                            const color = line.colorHex;
                            const textColor = line.textColorHex;
                            
                            if (line.lineNumber === "WALK") {
                              return (
                                <div
                                  key={`${line.lineNumber}-${index}`}
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
                            };
                            return (
                              <span
                                key={`${line.lineNumber}-${index}`}
                                style={style}
                                className="rounded px-1.5 py-0.5 font-bold text-sm leading-none border border-border"
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
                </li>
              ))
              )}
            </ul>
            
            {/* Load More Button */}
            {!isLoading && routes.length > 0 && onLoadMore && (
              <div className="mt-4">
                <Button
                  onClick={onLoadMore}
                  disabled={isLoadingMore}
                  variant="outline"
                  className="w-full"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {isLoadingMore ? "Ładowanie..." : "Wyświetl późniejsze odjazdy"}
                </Button>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailableRoutes;
