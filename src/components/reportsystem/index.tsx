import { useState } from "react";
import { useMapEvents } from "react-leaflet";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "../../services/api";
import { IconSet, type Icon } from "./types";
import { useAuth } from "@/context/AuthContext";

const MapClickListener = ({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

interface ReportSystemProps {
  lat: number | null | undefined;
  long: number | null | undefined;
  onResetLocation: () => void;
  onAlertAdded?: () => void;
  step: 1 | 2 | 3 | 4;
  onStepChange: (step: 1 | 2 | 3 | 4) => void;
}

function ReportSystem({
  lat,
  long,
  onResetLocation,
  onAlertAdded,
  step,
  onStepChange,
}: ReportSystemProps) {
  const { isLoggedIn, token, updateToken } = useAuth();
  const [selectedLine, setSelectedLine] = useState<string>("");
  const [alertSelection, setAlertSelection] = useState<Icon | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [lineError, setLineError] = useState<string | null>(null);

  const handleFirstStep = (option: Icon) => {
    setAlertSelection(option);
    onResetLocation();
    onStepChange(2);
  };

  const handlePositionSelection = () => {
    if (!lat || !long) return;
    onStepChange(3);
  };

  const validateLine = (value: string): boolean => {
    if (!value) {
      setLineError(null);
      return true;
    }
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1 || num > 1000) {
      setLineError("Numer linii musi być między 1 a 1000");
      return false;
    }
    setLineError(null);
    return true;
  };

  const handleLineInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedLine(value);
    validateLine(value);
  };

  const handleLineSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedLine(value);
    validateLine(value);
  };

  const handleLineStepNext = () => {
    if (validateLine(selectedLine)) {
      onStepChange(4);
    }
  };

  const handleSubmit = async () => {
    if (lat && long && alertSelection) {
      const lineToSend = selectedLine ? selectedLine : null;
      if (token) {
        try {
          const { new_token: newToken } = await api.createAlert(
            lat,
            long,
            alertSelection.id,
            lineToSend,
            token
          );
          updateToken(newToken);
          setSubmitted(true);
          onResetLocation();
          if (onAlertAdded) {
            onAlertAdded();
          }
        } catch (error) {
          console.error("Failed to create alert:", error);
          // Handle error (maybe show toast)
        }
      }
    }
  };

  const handleReset = () => {
    onStepChange(1);
    setAlertSelection(null);
    setSelectedLine("");
    setSubmitted(false);
    setLineError(null);
  };

  return (
    <Card className="absolute w-80 z-50 right-10 bottom-10 shadow-xl flex flex-col animate-in slide-in-from-bottom-5">
      {!submitted ? (
        <>
          <CardHeader className="pb-2">
            <CardTitle>
              {step === 1 && "Zgłoś problem"}
              {step === 2 && "Gdzie to jest?"}
              {step === 3 && "Jaka linia?"}
              {step === 4 && "Podsumowanie"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Wybierz kategorię zgłoszenia"}
              {step === 2 && "Wybierz punkt na mapie"}
              {step === 3 && "Wpisz numer linii lub wybierz z listy"}
              {step === 4 && "Sprawdź czy wszystko się zgadza"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            {/* --- STEP 1: WYBÓR IKONY --- */}
            {step === 1 &&
              (isLoggedIn ? (
                <div className="grid grid-cols-2 gap-2">
                  {IconSet.map((item) => (
                    <Button
                      key={item.id}
                      variant="outline"
                      className="h-20 flex flex-col gap-1"
                      onClick={() => handleFirstStep(item)}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-xs font-medium">{item.label}</span>
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Musisz być zalogowany, aby dodawać zgłoszenia.
                </p>
              ))}

            {/* --- STEP 2: LOKALIZACJA --- */}
            {step === 2 && (
              <div className="flex flex-col gap-4 animate-in fade-in">
                <div className="flex items-center gap-2 justify-center p-4 bg-muted/50 rounded-lg border border-dashed">
                  <div className="text-2xl">{alertSelection?.icon}</div>
                  <div className="font-medium">{alertSelection?.label}</div>
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  Kliknij na mapie, aby zaznaczyć miejsce zdarzenia.
                </p>
              </div>
            )}

            {/* --- STEP 3: WYBÓR LINII --- */}
            {step === 3 && (
              <div className="flex flex-col gap-4 animate-in fade-in">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Numer linii (opcjonalnie)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="np. 12"
                      value={selectedLine}
                      onChange={handleLineInputChange}
                      className={
                        lineError
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }
                    />
                    <select
                      className="h-9 w-[80px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      onChange={handleLineSelectChange}
                      value={selectedLine}
                    >
                      <option value="">--</option>
                      {Array.from({ length: 20 }, (_, i) => i + 1).map(
                        (val) => (
                          <option key={val} value={val}>
                            {val}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  {lineError && (
                    <p className="text-xs text-destructive">{lineError}</p>
                  )}
                </div>
              </div>
            )}

            {/* --- STEP 4: PODSUMOWANIE --- */}
            {step === 4 && (
              <div className="animate-in fade-in space-y-4">
                <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Typ:</span>
                    <span className="font-medium flex items-center gap-1">
                      {alertSelection?.icon} {alertSelection?.label}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Lokalizacja:</span>
                    <span className="font-medium text-right">
                      {lat?.toFixed(5)}, {long?.toFixed(5)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Linia:</span>
                    <span className="font-medium">
                      {selectedLine || "Brak"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between gap-2 pt-2">
            {step === 2 && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => onStepChange(1)}
                  className="flex-1"
                >
                  Wróć
                </Button>
                <Button
                  onClick={handlePositionSelection}
                  disabled={!lat || !long}
                  className="flex-1"
                >
                  Dalej
                </Button>
              </>
            )}
            {step === 3 && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => onStepChange(2)}
                  className="flex-1"
                >
                  Wróć
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedLine("");
                    onStepChange(4);
                  }}
                  className="flex-1"
                >
                  Pomiń
                </Button>
                <Button onClick={handleLineStepNext} className="flex-1">
                  Dalej
                </Button>
              </>
            )}
            {step === 4 && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => onStepChange(3)}
                  className="flex-1"
                >
                  Popraw
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleSubmit}
                  className="flex-1"
                >
                  Wyślij
                </Button>
              </>
            )}
          </CardFooter>
        </>
      ) : (
        <CardContent className="flex flex-col items-center justify-center py-10 animate-in zoom-in-50">
          <div className="text-5xl mb-4">✅</div>
          <h4 className="text-xl font-bold text-green-600 mb-2">Wysłano!</h4>
          <p className="text-muted-foreground text-center mb-6">
            Dziękujemy za zgłoszenie.
          </p>
          <Button variant="outline" onClick={handleReset}>
            Zgłoś kolejne
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

export { ReportSystem, MapClickListener };
