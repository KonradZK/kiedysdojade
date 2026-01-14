import { divIcon } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { api } from "../../services/api";
import { IconSet, type Alert } from "../reportsystem/types";

const getIconForCategory = (category: string) => {
  const iconData = IconSet.find((i) => i.id === category) || IconSet[0];
  return divIcon({
    className: "bg-transparent",
    html: `<div class="w-8 h-8 flex items-center justify-center text-2xl drop-shadow-md filter cursor-pointer transition-transform hover:scale-110">${iconData.icon}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -10],
  });
};

const TimeAgo = ({ since }: { since: string }) => {
  const [label, setLabel] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const past = new Date(since);
      const diffMs = now.getTime() - past.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) {
        setLabel("przed chwilą");
      } else if (diffMins < 60) {
        setLabel(`${diffMins} min temu`);
      } else {
        const diffHours = Math.floor(diffMins / 60);
        setLabel(`${diffHours} godz. temu`);
      }
    };

    update();
    const interval = setInterval(update, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [since]);

  return <span className="text-[10px] text-muted-foreground">{label}</span>;
};

function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await api.getAlerts();
        setAlerts(data);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      }
    };

    fetchAlerts();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleVote = async (id: string, delta: number) => {
    // Optimistic update
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, score: alert.score + delta } : alert
      )
    );

    await api.voteAlert(id, delta);
  };

  return (
    <>
      {alerts.map((alert) => {
        const iconData = IconSet.find((i) => i.id === alert.category);
        const icon = iconData ? iconData.icon : "📍";
        
        return (
          <Marker
            key={alert.id}
            position={[alert.lat, alert.lon]}
            icon={getIconForCategory(alert.category)}
          >
            <Popup
              className="alert-popup [&_.leaflet-popup-content-wrapper]:!bg-card [&_.leaflet-popup-content-wrapper]:!text-card-foreground [&_.leaflet-popup-tip]:!bg-card [&_.leaflet-popup-close-button]:!text-muted-foreground [&_.leaflet-popup-close-button]:hover:!text-foreground [&_.leaflet-popup-content-wrapper]:!rounded-xl [&_.leaflet-popup-content-wrapper]:!p-0 [&_.leaflet-popup-content]:!m-0 [&_.leaflet-popup-content]:!w-auto"
            >
              <div className="flex flex-col gap-3 min-w-[200px] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 text-2xl shrink-0">
                    {icon}
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <span className="font-semibold text-sm leading-none tracking-tight">
                      {iconData?.label || alert.category}
                    </span>
                    {alert.line && (
                      <span className="inline-flex items-center self-start rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">
                        Linia: {alert.line}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs font-medium text-muted-foreground">
                    Ocena: {alert.score}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 rounded-full"
                      onClick={() => handleVote(alert.id, -1)}
                    >
                      -
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-green-100 hover:text-green-500 dark:hover:bg-green-900/30 rounded-full"
                      onClick={() => handleVote(alert.id, 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end border-t border-border pt-2 mt-[-4px]">
                  <TimeAgo since={alert.since} />
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

export { Alerts };
