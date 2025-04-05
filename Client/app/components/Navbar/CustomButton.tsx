"use client";
import { RightToolTip } from "./RightToolTip";
import { useTheme } from "@/app/context/ThemeContext";
import "../../globals.css";
import { useEffect } from "react";

interface buttonProps {
  text: string;
  icon: React.ReactNode;
  tooltipText: string;
  action?: () => void;
  type?: "button" | "submit" | "reset";
  toggleType?: "theme";
  disabled?: boolean;
  guest?: boolean;
}

export const CustomButton: React.FC<buttonProps> = ({
  text,
  icon,
  tooltipText,
  action,
  type,
  disabled,
  guest,
}) => {
  const { expanded } = useTheme();

  return (
    <button
      disabled={disabled}
      className={`"overflow-hidden " ${
        !disabled
          ? expanded
            ? "NavButton"
            : "sNavButton group "
          : "rounded-l flex w=[100%] mb-5 py-1 justify-center relative h-[30px] z-50"
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
      {disabled ? (
        <span
          className={`overflow-hidden transition-all ${expanded ? "" : "w-0"}`}
        >
          {`${text} not available in demo`}
        </span>
      ) : (
        <span
          className={`overflow-hidden transition-all ${expanded ? "" : "w-0"}`}
        >
          {text}
        </span>
      )}

      {expanded || disabled ? null : (
        <RightToolTip text={tooltipText}></RightToolTip>
      )}
    </button>
  );
};
