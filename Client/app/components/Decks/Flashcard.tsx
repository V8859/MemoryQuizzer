"use client";
import { useEffect } from "react";
import React from "react";
import "@/app/Styles/Card.css";
import { useTheme } from "../../context/ThemeContext";

export const FlashCard = ({
  Front,
  Back,
  isFlipped,
  setFlipped,
}: {
  Front: string;
  Back: string;
  isFlipped: boolean;
  setFlipped: (isFlipped: boolean) => void;
}) => {
  const { theme } = useTheme();

  // Apply theme class to body element
  useEffect(() => {
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(`${theme}-theme`);
  }, [theme]);

  const handleFlip = () => {
    setFlipped(!isFlipped);
  };

  return (
    <div className={"container " + "pt-[5%]"}>
      <div className={`flip-card ${isFlipped ? "flipped" : ""}`}>
        <div className="flip-card-inner">
          <div className="flip-card-front" onClick={handleFlip}>
            <p className="card-content">{Front}</p>
          </div>
          <div className="flip-card-back" onClick={handleFlip}>
            <p className="card-content">{Back}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
