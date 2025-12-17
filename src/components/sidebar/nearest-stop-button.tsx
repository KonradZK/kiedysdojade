import { useState } from "react";
import { Button } from "../ui/button";
import { LocateFixed, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import type { StopGroup } from "./types";

interface NearestStopButtonProps {
  onSelect: (stop: StopGroup) => void;
}

export const NearestStopButton = ({ onSelect }: NearestStopButtonProps) => {
  const [isLocating, setIsLocating] = useState(false);

  const findNearest = () => {
    if (!navigator.geolocation) {
      toast.error("Geolokalizacja jest niedostępna w tej przeglądarce.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const closestStop = await api.getClosestStop(latitude, longitude);
          onSelect(closestStop);
          toast.success(`Wybrany przystanek: ${closestStop.group_name}`);
          setIsLocating(false);
        } catch (err) {
          toast.error("Nie udało się pobrać najbliższego przystanku.");
          setIsLocating(false);
        }
      },
      () => {
        toast.error("Nie udało się pobrać lokalizacji.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={findNearest}
      disabled={isLocating}
      className="h-8 w-8 text-muted-foreground hover:text-foreground"
      title="Znajdź najbliższy przystanek"
    >
      {isLocating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LocateFixed className="h-4 w-4" />
      )}
    </Button>
  );
};
