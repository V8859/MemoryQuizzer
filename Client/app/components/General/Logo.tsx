"use client";
import { useTheme } from "@/app/context/ThemeContext";
import React from "react";
import ToggleButton from "../Navbar/ToggleButton";

const Logo = () => {
  const { expanded } = useTheme();
  return (
    <>
      <div
        className={`flex w-full flex-grow justify-between ${
          expanded ? "flex-row" : "flex-col"
        } gap-2`}
      >
        <div className={`w-fit flex flex-col basicHeaderColor rounded`}>
          <div
            className={`relative text-start px-1 justify-start font-black ${
              expanded ? "text-[20px]" : "text-[15px]"
            }`}
          >
            {expanded ? `MemoryQuizzer` : `MQ`}
          </div>
        </div>
        <ToggleButton></ToggleButton>
      </div>
    </>
  );
};

export default Logo;
