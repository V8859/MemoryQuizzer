"use client"; // Directive to use this as a client component

import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { ChevronFirst, ChevronLast } from "lucide-react";
import "../../globals.css";
const ToggleButton = () => {
  const { expanded, toggleCollapse } = useTheme();
  return (
    <button className={`SideBarToggleButton`} onClick={toggleCollapse}>
      {expanded ? <ChevronFirst /> : <ChevronLast />}
    </button>
  );
};

export default ToggleButton;
