"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useScreenSize } from "../components/CustomHooks/useScreenSize";
import { getNotebooks } from "../scripts/notebook";
import { guestMode, useData } from "./DataContext";
interface ThemeContextProps {
  theme: string;
  toggleTheme: () => void;
  expanded: boolean;
  toggleCollapse: () => void;
  setNotebooks: Function;
  notebooks: any;
  notebooksChanged: number;
  setNotebooksChanged: any;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const restrictedScreenSizes = ["xs", "sm", "md"];

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState("light");
  const [expanded, setExpanded] = useState(false);
  const [notebooks, setNotebooks] = useState([]);
  const [notebooksChanged, setNotebooksChanged] = useState(Number);
  const screenSize = useScreenSize();
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      if (prevTheme === "light") {
        localStorage.setItem("theme", "dark");
        return "dark";
      } else if (prevTheme === "dark") {
        localStorage.setItem("theme", "original");
        return "original";
      } else {
        localStorage.setItem("theme", "light");
        return "light";
      }
    });
  };

  const toggleCollapse = () => {
    if (!compareString(screenSize, restrictedScreenSizes)) {
      console.log(!compareString(screenSize, restrictedScreenSizes));
      setExpanded((prevState) => !prevState);
    }
  };
  useEffect(() => {
    console.log("Screen Size changed");
    if (screenSize === "xs" || screenSize === "sm" || screenSize === "md") {
      setExpanded(false);
    }
  }, [screenSize]);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    const fetchNotebooks = async () => {
      let response = null;
      let userId = null;
      if (!guestMode) {
        userId = localStorage.getItem("userId");
      }

      if (!guestMode && userId !== "0") {
        response = await getNotebooks(userId);
      }
      if (guestMode) {
        response = await getNotebooks();
      }
      if (response) {
        setNotebooks(response);
      }
    };
    fetchNotebooks();
    console.log("REFETCH NOTEBOOKS");
  }, [notebooksChanged]);
  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        expanded,
        toggleCollapse,
        setNotebooks,
        notebooks,
        setNotebooksChanged,
        notebooksChanged,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

const compareString = (main: string, compare: string | string[]) => {
  if (typeof compare === "string") {
    return main === compare;
  } else {
    for (let r in compare) {
      if (compare[r] === main) {
        return true;
      }
    }
  }
};
