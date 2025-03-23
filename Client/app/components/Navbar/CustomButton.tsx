"use client";
import { RightToolTip } from "./RightToolTip";
import { useTheme } from "@/app/context/ThemeContext";
import "../../globals.css";

interface buttonProps {
  text: string;
  icon: React.ReactNode;
  tooltipText: string;
  action?: () => void;
  type?: "button" | "submit" | "reset";
  toggleType?: "theme";
}

export const CustomButton: React.FC<buttonProps> = ({
  text,
  icon,
  tooltipText,
  action,
  type,
}) => {
  const { expanded } = useTheme();

  return (
    <button
      className={`"overflow-hidden " ${
        expanded ? "NavButton" : "sNavButton group "
      }`}
      onClick={
        action
          ? () => {
              action();
            }
          : undefined
      }
      type={type}
    >
      <div className="w-[30px]">{icon}</div>
      <span
        className={`overflow-hidden transition-all ${expanded ? "" : "w-0"}`}
      >
        {text}
      </span>
      {!expanded && <RightToolTip text={tooltipText}></RightToolTip>}
    </button>
  );
};
