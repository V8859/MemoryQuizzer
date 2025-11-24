"use client"; // Directive to use this as a client component

import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { ChevronFirst } from "lucide-react";
import "../../globals.css";
const ToggleButton = () => {
  const { expanded, toggleCollapse } = useTheme();
  return (
    <button type="button" title={expanded ? "collapse" : "expand"} className={`SideBarToggleButton transition-all duration-300 ease-in-out`} onClick={toggleCollapse}>
      <ChevronFirst
        className={`transform transition-all duration-300 ease-in-out ${expanded ? "rotate-0" : "rotate-180"
          }`}
      >
      </ChevronFirst>
    </button>
  );
};

export default ToggleButton;
