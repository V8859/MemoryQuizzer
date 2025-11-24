"use client";

import { RightToolTip } from "./RightToolTip";
import { useTheme } from "@/app/context/ThemeContext";
import "../../globals.css";

interface buttonProps {
  icon: React.ReactNode;
  action?: () => void;
  type?: "button" | "submit" | "reset";
}

export const ToggleThemeButton: React.FC<buttonProps> = ({ icon, type }) => {
  const { expanded, theme, toggleTheme } = useTheme();

  return (
    <button
      className={`"overflow-hidden transition-all" ${expanded ? "NavButton" : "sNavButton group"
        }`}
      onClick={toggleTheme}
      type={type}
    >
      <div className="w-[30px]">{icon}</div>
      <span
        className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? "w-52" : "w-0"}`}
      >
        {theme[0].toUpperCase() + theme.slice(1)}
      </span>
      {!expanded && (
        <RightToolTip
          text={theme[0].toUpperCase() + theme.slice(1)}
        ></RightToolTip>
      )}
    </button>
  );
};
