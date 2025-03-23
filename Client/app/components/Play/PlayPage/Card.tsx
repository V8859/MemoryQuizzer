"use client";
import { useState, useEffect } from "react";
import React from "react";
import "@/app/Styles/Card.css";
import { useTheme } from "@/app/context/ThemeContext";

export const Card = ({
  Front,
  Back,
  isFlipped,
}: {
  isFlipped: boolean;
  Front: string;
  Back: string;
}) => {
  const { theme } = useTheme();

  // Apply theme class to body element
  useEffect(() => {
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(`${theme}-theme`);
  }, [theme]);

  return (
    <div className={"container " + "pt-[5%]"}>
      <div className={`flip-card ${isFlipped ? "flipped" : ""}`}>
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <p className="card-content">{Front}</p>
          </div>
          <div className="flip-card-back">
            <p className="card-content">{Back}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
