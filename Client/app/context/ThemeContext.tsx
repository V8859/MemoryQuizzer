"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useScreenSize } from "../components/CustomHooks/useScreenSize";
import { getNotebooks } from "../scripts/notebook";
interface ThemeContextProps {
  theme: string;
  toggleTheme: () => void;
  expanded: boolean;
  toggleCollapse: () => void;
  setNotebooks: Function;
  notebooks: any;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const restrictedScreenSizes = ["xs", "sm", "md"];

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState("light");
  const [expanded, setExpanded] = useState(false);
  const [notebooks, setNotebooks] = useState([]);
  const screenSize = useScreenSize();
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      if (prevTheme === "light") {
        return "dark";
      } else if (prevTheme === "dark") {
        return "original";
      } else {
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
    const fetchNotebooks = async () => {
      const userId = localStorage.getItem("userId");
      let response;
      if (userId) {
        response = await getNotebooks(userId);
      }
      setNotebooks(response);
    };
    fetchNotebooks();
  }, [notebooks]);
  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        expanded,
        toggleCollapse,
        setNotebooks,
        notebooks,
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
