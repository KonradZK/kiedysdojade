import { useState } from "react";
import { useMapEvents } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "../../services/api";
import { IconSet, type Icon } from "./types";

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
}

function ReportSystem({ lat, long, onResetLocation }: ReportSystemProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [alertSelection, setAlertSelection] = useState<Icon | null>(null);

  const [submitted, setSubmitted] = useState(false);

  const handleFirstStep = (option: Icon) => {
    setAlertSelection(option);
    onResetLocation();
    setStep(2);
  };

  const handlePositionSelection = () => {
    if (!lat || !long) return;
    setStep(3);
  };

  const handleLineSelection = (line: string | null) => {
    setSelectedLine(line);
    setStep(4);
  };

  const handleSubmit = async () => {
    if (lat && long && alertSelection) {
      await api.createAlert(lat, long, alertSelection.id, selectedLine);
      setSubmitted(true);
      onResetLocation();
    }
  };

  const handleReset = () => {
    setStep(1);
    setAlertSelection(null);
    setSelectedLine(null);
    setSubmitted(false);
  };

  return (
    // Zmieniłem h-20 na h-auto i dodałem p-4, żeby treść się zmieściła
    <Card className="absolute h-auto min-h-[200px] w-64 z-50 right-10 bottom-10 shadow-xl flex flex-col items-center justify-center text-center animate-in slide-in-from-bottom-5">
      <CardContent className="p-4 w-full flex flex-col items-center">
      {/* Nagłówek (tylko jeśli nie wysłano sukcesu) */}
      {!submitted && (
        <h1 className="text-lg font-bold mb-4">Zgłoś problem</h1>
      )}

      <div className="w-full">
        {/* --- STEP 1: WYBÓR IKONY --- */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-2 w-full">
            {IconSet.map((item) => (
              <Button
                key={item.id}
                variant="outline"
                className="h-20 flex flex-col gap-1"
                onClick={() => handleFirstStep(item)}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-medium">
                  {item.label}
                </span>
              </Button>
            ))}
          </div>
        )}

        {/* --- STEP 2: LOKALIZACJA --- */}
        {step === 2 && (
          <div className="flex flex-col gap-2 animate-in fade-in">
            <div className="text-sm text-gray-500 mb-1 flex items-center gap-2 justify-center">
              <span>{alertSelection?.icon}</span>
              <span>Gdzie to jest?</span>
            </div>

            <p>Wybierz punkt na mapie</p>

            <div className="flex gap-2 mt-2 w-full">
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Wróć
              </Button>
              <Button
                onClick={handlePositionSelection}
                className="flex-1"
                disabled={!lat || !long}
              >
                Dalej
              </Button>
            </div>
          </div>
        )}

        {/* --- STEP 3: WYBÓR LINII --- */}
        {step === 3 && (
          <div className="flex flex-col gap-2 animate-in fade-in">
             <div className="text-sm text-gray-500 mb-1 flex items-center gap-2 justify-center">
              <span>{alertSelection?.icon}</span>
              <span>Jaka linia?</span>
            </div>
            
            <p className="mb-2">Wybierz numer linii (opcjonalnie)</p>
            
            <div className="grid grid-cols-5 gap-1 max-h-40 overflow-y-auto mb-2 w-full">
                 {Array.from({ length: 20 }, (_, i) => String(i + 1)).map((line) => (
                <Button
                  key={line}
                    variant="outline"
                    className="h-8 p-0 text-xs"
                    onClick={() => handleLineSelection(line)}
                  >
                    {line}
                  </Button>
              ))}
            </div>

            <div className="flex gap-2 w-full">
               <Button
                variant="ghost"
                onClick={() => setStep(2)}
                className="flex-1"
              >
                Wróć
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleLineSelection(null)}
                className="flex-1"
              >
                Pomiń
              </Button>
            </div>
          </div>
        )}

        {/* --- STEP 4: PODSUMOWANIE I SUKCES --- */}
        {step === 4 && (
          <div>
            {!submitted ? (
              // WIDOK PRZED WYSŁANIEM
              <div className="animate-in zoom-in-95 w-full">
                <div className="bg-muted p-3 rounded-lg mb-4 text-left text-sm">
                  <p>
                    <strong>Typ:</strong> {alertSelection?.icon}{" "}
                    {alertSelection?.label}
                  </p>
                  <p>
                    <strong>Lat:</strong> {lat}
                  </p>
                  <p>
                    <strong>Long:</strong> {long}
                  </p>
                  <p>
                    <strong>Linia:</strong> {selectedLine || "Brak"}
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <Button
                    onClick={handleSubmit}
                    variant="destructive"
                    className="w-full"
                  >
                    Wyślij zgłoszenie
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setStep(3)}
                    className="w-full text-xs"
                  >
                    Popraw dane
                  </Button>
                </div>
              </div>
            ) : (
              // WIDOK PO WYSŁANIU (SUKCES)
              <div className="animate-in zoom-in-50 py-4 flex flex-col items-center">
                <div className="text-4xl mb-2">✅</div>
                <h4 className="text-lg font-bold text-green-600 mb-4">
                  Wysłano!
                </h4>
                <Button
                  variant="link"
                  onClick={handleReset}
                  className="text-sm"
                >
                  Zgłoś kolejne
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      </CardContent>
    </Card>
  );
}

export { ReportSystem, MapClickListener };
