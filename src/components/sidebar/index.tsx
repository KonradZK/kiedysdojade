import { RouteSelection } from "./route-selection";
import { SidebarHeader } from "./header";
import RouteDetails from "./route-details";
import AvailableRoutes from "./available-routes";
import { LoginForm } from "../login/login-form";
import { SignupForm } from "../login/signup-form";
import { useState } from "react";
import { Button } from "../ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { ArrowLeft, ChevronUp } from "lucide-react";
import { api } from "@/services/api";
import { processRoutes } from "@/utils/route-processing";
import { useRouteTimer } from "@/hooks/useRouteTimer";

import type { Stop, StopGroup, RouteProps, Path, LineInfo } from "./types";

interface SidebarProps {
  isDark: boolean;
  stops: StopGroup[];
  toggleTheme: (value: boolean) => void;
  onShowRoute: (route: Stop[], path: Path, lines: LineInfo[]) => void;
  onStopSelect?: (start: StopGroup | null, end: StopGroup | null) => void;
  routeStops: Stop[];
}

const Sidebar = ({
  isDark,
  toggleTheme,
  stops,
  onShowRoute,
  onStopSelect,
  routeStops,
}: SidebarProps) => {
  const [isRouteSelected, setIsRouteSelected] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [fetchedRoutes, setFetchedRoutes] = useState<RouteProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
  const [currentStart, setCurrentStart] = useState<string>("");
  const [currentEnd, setCurrentEnd] = useState<string>("");
  const [nextDepartureTime, setNextDepartureTime] = useState<string | undefined>(undefined);

  const handleRouteSelect = async (
    start: string,
    end: string,
    departureTime?: string
  ) => {
    setIsRouteSelected(true);
    setSelectedTripId(null);
    setCurrentStart(start);
    setCurrentEnd(end);
    setFetchedRoutes([]);
    setIsLoading(true);
    
    try {
      await fetchRoutesSequentially(start, end, departureTime, 5, true);
    } catch (err) {
      console.error("Error fetching routes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoutesSequentially = async (
    start: string,
    end: string,
    departureTime: string | undefined,
    count: number,
    reset: boolean = false
  ) => {
    const PALETTE = ["#22c55e", "#3b82f6", "#ef4444", "#8b5cf6", "#f59e0b"];
    let currentDepartureTime = departureTime;
    let isFirstRoute = true;

    if (reset) {
      setFetchedRoutes([]);
    }

    for (let i = 0; i < count; i++) {
      try {
        const paths: Path[] = await api.getAvailablePaths(
          start,
          end,
          currentDepartureTime,
          1
        );
        
        if (paths.length === 0) break;

        const cleanedPaths = paths.map((path) => path.slice(1, -1));

        const baseRoutes = processRoutes(cleanedPaths);

        if (baseRoutes.length === 0) break;

        const routesWithShapes: RouteProps[] = await Promise.all(
          baseRoutes.map(async (route) => {
            const enrichedLines: LineInfo[] = await Promise.all(
              route.lines.map(async (line, idx) => {
                if (line.lineNumber === "WALK") {
                  return {
                    ...line,
                    colorHex: "#ffffff",
                    textColorHex: "#0f172a",
                    shape: [],
                  };
                }
                try {
                  const shape = await api.getShapePoints(
                    line.lineNumber,
                    line.startCode,
                    line.endCode
                  );
                  return {
                    ...line,
                    colorHex: PALETTE[idx % PALETTE.length],
                    textColorHex: undefined,
                    shape,
                  };
                } catch (e) {
                  console.error("Error fetching shape for line", line.lineNumber, e);
                  return {
                    ...line,
                    colorHex: PALETTE[idx % PALETTE.length],
                    textColorHex: undefined,
                    shape: [],
                  };
                }
              })
            );

            return { ...route, lines: enrichedLines };
          })
        );

        setFetchedRoutes((prev) => [...prev, ...routesWithShapes]);

        if (reset && isFirstRoute && routesWithShapes.length > 0) {
          const firstRoute = routesWithShapes[0];
          const firstStops = firstRoute.path.map((rs) => rs.stop);
          onShowRoute(firstStops, firstRoute.path, firstRoute.lines);
          isFirstRoute = false;
        }

        const currentRoute = routesWithShapes[0];
        const [hour, minute] = currentRoute.departureTime.split(":").map(Number);
        const nextMinute = minute + 1;
        const nextHour = nextMinute >= 60 ? (hour + 1) % 24 : hour;
        const adjustedMinute = nextMinute >= 60 ? 0 : nextMinute;
        currentDepartureTime = `${String(nextHour).padStart(2, "0")}:${String(adjustedMinute).padStart(2, "0")}`;

      } catch (err) {
        console.error(`Error fetching route ${i + 1}:`, err);
        break;
      }
    }

    setNextDepartureTime(currentDepartureTime);
  };

  const handleLoadMore = async () => {
    if (!currentStart || !currentEnd) return;
    
    setIsLoadingMore(true);
    try {
      await fetchRoutesSequentially(currentStart, currentEnd, nextDepartureTime, 5, false);
    } catch (err) {
      console.error("Error loading more routes:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleStopSelect = async (stop_code: string) => {
    setSelectedTripId(stop_code);
    
    if (stop_code.startsWith("route-")) {
      const selectedRoute = fetchedRoutes.find((route) => route.id === stop_code);
      if (selectedRoute) {
        const stops = selectedRoute.path.map((e) => e.stop);
        onShowRoute(stops, selectedRoute.path, selectedRoute.lines);
      }
      return;
    }

    try {
      await api.getTimeTable(stop_code);
    } catch (e) {
      console.error("Error fetching stop times:", e);
    }
  };

  const handleHoverRoute = (route: RouteProps | null) => {
    if (!route) {
      onShowRoute([], [], []);
      return;
    }
    const stops = route.path.map((e) => e.stop);
    onShowRoute(stops, route.path, route.lines);
  };

  const handleBack = () => {
    if (selectedTripId) {
      setSelectedTripId(null);
    } else if (isRouteSelected) {
      setIsRouteSelected(false);
      onShowRoute([], [], []);
      setFetchedRoutes([]);
      setCurrentStart("");
      setCurrentEnd("");
      setNextDepartureTime(undefined);
    }
  };

  const updatedRoutes = useRouteTimer(fetchedRoutes);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex absolute top-4 left-4 z-10 w-80 bg-sidebar text-sidebar-foreground border border-sidebar-border shadow-xl rounded-xl p-6 flex-col gap-2 transition-all duration-300 ease-in-out max-h-[90vh] overflow-hidden">
        <SidebarHeader
          isDark={isDark}
          toggleTheme={toggleTheme}
          authMode={authMode}
          onAuthModeChange={setAuthMode}
        />

        {authMode === "login" && (
          <LoginForm 
            onSwitchToSignup={() => setAuthMode("signup")}
            onSuccess={() => setAuthMode(null)} 
          />
        )}
        {authMode === "signup" && (
          <SignupForm 
            onSwitchToLogin={() => setAuthMode("login")}
            onSuccess={() => setAuthMode(null)}
          />
        )}

        {!authMode && (
          <>
            <RouteSelection
              stops={stops}
              onSelect={handleRouteSelect}
              onStopSelect={onStopSelect}
              disabled={isRouteSelected}
            />

            {isRouteSelected && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="h-8 w-8 shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium text-muted-foreground">
                  {selectedTripId ? "Wróć do wyników" : "Wróć do wyszukiwania"}
                </span>
              </div>
            )}

            {isRouteSelected && (
              <div className="flex-1 overflow-hidden flex flex-col">
                {!selectedTripId ? (
                  <AvailableRoutes
                    routes={updatedRoutes}
                    onSelect={handleStopSelect}
                    onHoverRoute={handleHoverRoute}
                    isLoading={isLoading}
                    onLoadMore={handleLoadMore}
                    isLoadingMore={isLoadingMore}
                  />
                ) : (
                  <RouteDetails
                    routeStops={routeStops}
                    route={updatedRoutes.find((r) => r.id === selectedTripId)}
                  />
                )}
              </div>
            )}
          </>
        )}
      </aside>

      {/* Mobile Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-20 md:hidden rounded-full h-14 w-14 bg-secondary hover:bg-primary/90 shadow-lg"
          >
            <ChevronUp className="h-6 w-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-sidebar text-sidebar-foreground border-sidebar-border">
          <div className="mx-auto w-full max-w-sm flex flex-col gap-4 p-6 h-[80vh] overflow-y-auto">
            <SidebarHeader
              isDark={isDark}
              toggleTheme={toggleTheme}
              authMode={authMode}
              onAuthModeChange={setAuthMode}
            />

            {authMode === "login" && (
              <LoginForm 
                onSwitchToSignup={() => setAuthMode("signup")}
                onSuccess={() => setAuthMode(null)}
              />
            )}
            {authMode === "signup" && (
              <SignupForm 
                onSwitchToLogin={() => setAuthMode("login")}
                onSuccess={() => setAuthMode(null)}
              />
            )}

            {!authMode && (
              <>
                <RouteSelection
                  stops={stops}
                  onSelect={(start, end) => {
                    handleRouteSelect(start, end);
                    setIsDrawerOpen(false);
                  }}
                  onStopSelect={onStopSelect}
                  disabled={isRouteSelected}
                />

                {isRouteSelected && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleBack}
                      className="h-8 w-8 shrink-0"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium text-muted-foreground">
                      {selectedTripId ? "Wróć do wyników" : "Wróć do wyszukiwania"}
                    </span>
                  </div>
                )}

                {isRouteSelected && (
                  <div className="flex-1 overflow-hidden flex flex-col">
                    {!selectedTripId ? (
                      <AvailableRoutes
                        routes={updatedRoutes}
                        onSelect={handleStopSelect}
                        onHoverRoute={handleHoverRoute}
                        isLoading={isLoading}
                        onLoadMore={handleLoadMore}
                        isLoadingMore={isLoadingMore}
                      />
                    ) : (
                      <RouteDetails
                        routeStops={routeStops}
                        route={updatedRoutes.find((r) => r.id === selectedTripId)}
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;
