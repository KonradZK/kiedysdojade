import { useEffect, useState } from "react"
import { MapContainer, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

function App() {
  const [isDark, setIsDark] = useState(false)

  // Odczyt z localStorage przy starcie
  useEffect(() => {
    const darkMode = localStorage.getItem("theme") === "dark"
    setIsDark(darkMode)
    document.documentElement.classList.toggle("dark", darkMode)
  }, [])

  // Zmiana motywu
  const toggleTheme = (value: boolean) => {
    setIsDark(value)
    document.documentElement.classList.toggle("dark", value)
    localStorage.setItem("theme", value ? "dark" : "light")
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <aside
        className="absolute top-4 left-4 z-10 w-80 
        bg-sidebar text-sidebar-foreground 
        border border-sidebar-border 
        shadow-xl rounded-xl 
        p-6 flex flex-col gap-4"
      >
        {/* Header z przełącznikiem */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold">Kiedyś Dojadę</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm">{isDark ? "🌙" : "☀️"}</span>
            <Switch checked={isDark} onCheckedChange={toggleTheme} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="start" className="text-sm font-medium text-foreground">
            Punkt początkowy
          </Label>
          <Input
            id="start"
            placeholder="np. Rondo Kaponiera"
            className="border border-input bg-secondary text-foreground
            rounded-md focus:ring-ring focus:border-ring transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="end" className="text-sm font-medium text-foreground">
            Punkt końcowy
          </Label>
          <Input
            id="end"
            placeholder="np. Plac Wolności"
            className="border border-input bg-secondary text-foreground
            rounded-md focus:ring-ring focus:border-ring transition-colors"
          />
        </div>
      </aside>

      {/* Mapa */}
      <div className="absolute inset-0">
        <MapContainer
          center={[52.4064, 16.9252]} // Poznań
          zoom={13}
          className="w-full h-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>
    </div>
  )
}

export default App
