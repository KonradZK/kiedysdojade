import { Label } from "@radix-ui/react-label";

interface Line {
  lineNumber: string;
}

interface RouteProps {
  timeToGo: string;
  lines: Line[];
  departureTime: string;
  arriveTime: string;
  routeTime: number;
  isDarkMode?: boolean;
  status?: string;
}

function Route({
  timeToGo,
  lines,
  departureTime,
  arriveTime,
  routeTime,
  isDarkMode = false,
  status = "Odjazd za:",
}: RouteProps) {
  // DarkMode colors
  const cardBg = isDarkMode
    ? "bg-[#1c1c1e] border-zinc-800"
    : "bg-white border-zinc-200";
  const textColor = isDarkMode ? "text-white" : "text-zinc-800";
  const lightTextColor = isDarkMode ? "text-zinc-400" : "text-zinc-500";
  const lighterTextColor = isDarkMode ? "text-zinc-500" : "text-zinc-600";
  const lineBoxBg = isDarkMode
    ? "bg-zinc-800/50 border-zinc-600"
    : "bg-zinc-100 border-zinc-300";
  const emeraldPillBg = isDarkMode
    ? "bg-emerald-950 border-emerald-900/50"
    : "bg-emerald-100 border-emerald-200";
  const emeraldPillText = isDarkMode ? "text-emerald-400" : "text-emerald-700";
  const skyPillBg = isDarkMode
    ? "bg-sky-950 border-sky-900/50"
    : "bg-sky-100 border-sky-200";
  const skyPillText = isDarkMode ? "text-sky-400" : "text-sky-700";

  return (
    <div
      className={`${cardBg} ${textColor} rounded-xl p-4 mb-3 flex justify-between items-stretch shadow-sm`}
    >
      <div className="flex flex-col justify-center w-70">
        <Label className={`text-xs ${lightTextColor} mb-1 font-medium`}>
          {status}
        </Label>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold tracking-tight leading-none">
            {timeToGo}
          </span>
          {timeToGo.length < 3 && (
            <span className={`text-sm ${lighterTextColor} ml-1 font-medium`}>
              min
            </span>
          )}
        </div>
      </div>

      {/* CENTER: Lines & Times */}
      <div className="flex flex-col flex-1 px-2 justify-center">
        {/* Line Numbers */}
        <div className="flex items-center gap-2 mb-2.5">
          {lines.map((line, index) => (
            <span
              key={index}
              className={`${lineBoxBg} rounded px-2 py-0.5 font-bold text-lg leading-none`}
            >
              {line.lineNumber}
            </span>
          ))}
        </div>

        {/* Time Pills */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <span
            className={`${emeraldPillBg} ${emeraldPillText} px-2 py-1 rounded-md`}
          >
            {departureTime}
          </span>

          <span className={`${lighterTextColor} font-normal text-[11px]`}>
            {routeTime} min
          </span>

          <span className={`${skyPillBg} ${skyPillText} px-2 py-1 rounded-md`}>
            {arriveTime}
          </span>
        </div>
      </div>

      {/* RIGHT: Duration */}
      <div className="flex items-start pt-1">
        <Label
          className={`${lighterTextColor} text-sm font-medium whitespace-nowrap`}
        >
          {routeTime} min
        </Label>
      </div>
    </div>
  );
}

export { Route };
export type { RouteProps };
