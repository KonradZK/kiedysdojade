import { useState } from "react";
import { useMapEvents } from "react-leaflet";
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
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [alertSelection, setAlertSelection] = useState<Icon | null>(null);

  const [submitted, setSubmitted] = useState(false);

  const handleFirstStep = (option: Icon) => {
    setAlertSelection(option);
    onResetLocation();
    setStep(2);
  };

  //   TODO
  const handleGoToSummary = () => {
    if (!lat || !long) return;
    setStep(3);
  };

  const handleSubmit = async () => {
    if (lat && long && alertSelection) {
      await api.createAlert(lat, long, alertSelection.id);
      setSubmitted(true);
      onResetLocation();
    }
  };

  const handleReset = () => {
    setStep(1);
    setAlertSelection(null);
    setSubmitted(false);
  };

  return (
    // Zmieniłem h-20 na h-auto i dodałem p-4, żeby treść się zmieściła
    <div className="absolute h-auto min-h-[200px] w-64 z-50 right-10 bottom-10 bg-white shadow-xl rounded-xl border border-gray-200 p-4 flex flex-col items-center justify-center text-center">
      {/* Nagłówek (tylko jeśli nie wysłano sukcesu) */}
      {!submitted && (
        <h1 className="text-lg font-bold mb-4 text-gray-800">Zgłoś problem</h1>
      )}

      <div className="w-full">
        {/* --- STEP 1: WYBÓR IKONY --- */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-2">
            {IconSet.map((item) => (
              <button
                key={item.id}
                onClick={() => handleFirstStep(item)}
                className="flex flex-col items-center justify-center p-2 bg-gray-50 hover:bg-blue-50 border rounded-lg transition-colors"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-medium text-gray-600">
                  {item.label}
                </span>
              </button>
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

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-1 text-sm text-gray-400 hover:text-gray-600"
              >
                Wróć
              </button>
              <button
                onClick={handleGoToSummary}
                className="flex-1 py-2 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                disabled={!lat || !long}
              >
                Dalej
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 3: PODSUMOWANIE I SUKCES --- */}
        {step === 3 && (
          <div>
            {!submitted ? (
              // WIDOK PRZED WYSŁANIEM
              <div className="animate-in zoom-in-95">
                <div className="bg-gray-100 p-3 rounded mb-4 text-left text-sm">
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
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleSubmit}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold transition-colors"
                  >
                    Wyślij zgłoszenie
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Popraw dane
                  </button>
                </div>
              </div>
            ) : (
              // WIDOK PO WYSŁANIU (SUKCES)
              <div className="animate-in zoom-in-50 py-4">
                <div className="text-4xl mb-2">✅</div>
                <h4 className="text-lg font-bold text-green-600 mb-4">
                  Wysłano!
                </h4>
                <button
                  onClick={handleReset}
                  className="text-sm text-blue-500 hover:underline"
                >
                  Zgłoś kolejne
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export { ReportSystem, MapClickListener };
