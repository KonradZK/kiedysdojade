import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import React from "react";
import { LogIn, LogOut, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SidebarHeaderProps {
  isDark: boolean;
  toggleTheme: (value: boolean) => void;
  authMode?: "login" | "signup" | null;
  onAuthModeChange?: (mode: "login" | "signup" | null) => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isDark,
  toggleTheme,
  authMode = null,
  onAuthModeChange,
}) => {
  const { isLoggedIn, logout } = useAuth();
  
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-semibold">Kiedyś Dojadę</h1>
      <div className="flex items-center gap-2">
        <span className="text-sm">{isDark ? "🌙" : "☀️"}</span>
        <Switch checked={isDark} onCheckedChange={toggleTheme} />
        
        {isLoggedIn ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="h-8 w-8"
            title="Wyloguj się"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        ) : (
          <>
            {authMode && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onAuthModeChange?.(null)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            {!authMode && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onAuthModeChange?.("login")}
                className="h-8 w-8"
              >
                <LogIn className="h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
