"use client";
import React, { use, useEffect, useState } from "react";
import "@/app/globals.css";
import Select, { StylesConfig } from "react-select";
import chroma from "chroma-js";
import { Card } from "./Card";
import { getNotebooks } from "@/app/scripts/notebook";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  selectedOption: any;
  setSelectedOption: any;
};

const data = {
  color: "white",
  back: "white",
  text: "white",
};
const dot = (color = "transparent") => ({
  alignItems: "center",
  display: "flex",

  ":before": {
    backgroundColor: "var(--hoverColor)",
    borderRadius: 10,
    content: '" "',
    display: "block",
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

const colourStyles: StylesConfig<ColourOption> = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "WelcomeMessage",
    color: "white",
    outlineStyle: "none",
    width: "15rem",
    cursor: "pointer",
  }),
  menu: (styles) => ({
    ...styles,
    width: "15rem",
    color: "white",
    backgroundColor: "var(--welcome-text)",
    cursor: "pointer",
  }),
  option: (styles, { isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.text);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? "var(--welcome-text)"
        : isSelected
        ? "var(--welcome-text)"
        : isFocused
        ? "var(--welcome-text)"
        : "var(--welcome-text)",
      color: isDisabled
        ? "blue"
        : isSelected
        ? chroma.contrast(color, "white") > 2
          ? "white"
          : undefined
        : "white",
      cursor: isDisabled ? "not-allowed" : "default",

      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled
          ? isSelected
            ? "var(--welcome-text)"
            : ""
          : undefined,
      },
      ":hover": {
        ...styles[":hover"],
        background: !isDisabled
          ? isSelected
            ? "var(--hoverColor)"
            : "var(--hoverColor)"
          : undefined,
        color: !isDisabled ? (isSelected ? "white" : "white") : undefined,
      },
    };
  },
  input: (styles) => ({ ...styles, ...dot() }),
  placeholder: (styles) => ({ ...styles, color: "white", ...dot("white") }),
  singleValue: (styles, { data }) => ({
    ...styles,
    color: "white",
    ...dot("white"),
  }),
};
const DropDown = ({ selectedOption, setSelectedOption }) => {
  const [notebooks, setNotebooks] = useState([]);

  const handleChange = (selectedOption) => {
    console.log(selectedOption);
    setSelectedOption(selectedOption);
  };
  useEffect(() => {
    const fetchNotebooks = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const books = await getNotebooks(userId);
        for (const key in books) {
          if (Object.prototype.hasOwnProperty.call(books, key)) {
            const element = books[key];
            element.label = element.name;
          }
        }

        setNotebooks(books);
      }
    };
    fetchNotebooks();
  }, []);

  return (
    <div className="flex justify-center mb-[4px]">
      <Select
        options={notebooks}
        value={selectedOption}
        onChange={handleChange}
        styles={colourStyles}
      ></Select>
    </div>
  );
};

export default DropDown;
