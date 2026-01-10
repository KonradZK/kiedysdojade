import { divIcon } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { IconSet, type Alert } from "../reportsystem/types";

const createAlertIcon = (emoji: string) => {
  return divIcon({
    html: `
        <div style="
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          border: 2px solid #fff;
        ">
          ${emoji}
        </div>
      `,
    className: "custom-alert-icon",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

const TimeAgo = ({ since }: { since: string }) => {
  const [timeString, setTimeString] = useState("");
  const timestamp = new Date(since).getTime();

  useEffect(() => {
    const updateTime = () => {
      const now = Date.now();
      const diff = Math.floor((now - timestamp) / 60000); // minutes

      if (diff < 1) {
        setTimeString("przed chwilą");
      } else if (diff < 60) {
        setTimeString(`${diff} min temu`);
      } else {
        const hours = Math.floor(diff / 60);
        setTimeString(`${hours} godz temu`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [timestamp]);

  return <span className="text-xs text-gray-500">{timeString}</span>;
};

function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const fetchAlerts = async () => {
    try {
      const data = await api.getAlerts();
      setAlerts(data);
    } catch (e) {
      console.error("Failed to fetch alerts", e);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000); // Poll every 5 seconds
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
    fetchAlerts(); // Re-fetch to ensure consistency
  };

  return (
    <>
      {alerts.map((alert) => {
        const categoryData = IconSet.find((item) => item.id === alert.category);
        const icon = categoryData ? categoryData.icon : "⚠️";
        return (
          <Marker
            key={alert.id}
            position={{ lat: alert.lat, lng: alert.lon }}
            icon={createAlertIcon(icon)}
          >
            <Popup className="alert-popup">
              <div className="flex flex-col gap-2 min-w-[150px]">
                <div className="flex items-center gap-2 border-b pb-2">
                  <span className="text-2xl">{icon}</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">{alert.category}</span>
                    <TimeAgo since={alert.since} />
                  </div>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-xs font-semibold text-gray-600">
                    Ocena zgłoszenia:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVote(alert.id, -1)}
                      className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-100 text-red-500 transition-colors"
                    >
                      -
                    </button>
                    <span
                      className={`font-bold ${
                        alert.score > 0
                          ? "text-green-600"
                          : alert.score < 0
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {alert.score}
                    </span>
                    <button
                      onClick={() => handleVote(alert.id, 1)}
                      className="w-6 h-6 flex items-center justify-center rounded hover:bg-green-100 text-green-500 transition-colors"
                    >
                      +
                    </button>
                  </div>
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
