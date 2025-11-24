import { Switch } from "@/components/ui/switch";
import React from "react";

interface SidebarHeaderProps {
  isDark: boolean;
  toggleTheme: (value: boolean) => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isDark, toggleTheme }) => (
  <div className="flex items-center justify-between mb-4">
    <h1 className="text-2xl font-semibold ">Kiedyś Dojadę</h1>
    <div className="flex items-center gap-2">
      <span className="text-sm">{isDark ? "🌙" : "☀️"}</span>
      <Switch checked={isDark} onCheckedChange={toggleTheme} />
    </div>
  </div>
);
