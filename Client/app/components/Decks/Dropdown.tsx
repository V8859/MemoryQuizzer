"use client";
import React, { useEffect, useState } from "react";
import "@/app/globals.css";
import Select, {
  // ActionMeta,
  MultiValue,
  SingleValue,
  StylesConfig,
} from "react-select";
import chroma from "chroma-js";
import { useTheme } from "@/app/context/ThemeContext";

type selectedOption = ColourOption | undefined;

type book = {
  createdAt: string;
  id: string;
  label: string;
  name: string;
  score: number;
};

type Props = {
  selectedOption: selectedOption;
  setSelectedOption: (selectedOption: selectedOption) => void;
};

const data = {
  color: "white",
  back: "white",
  text: "white",
};
const dot = () => ({
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

type ColourOption = {
  createdAt: string;
  label: string;
  id: string;
  name: string;
  score: number;
};

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
  placeholder: (styles) => ({ ...styles, color: "white", ...dot() }),
  singleValue: (styles, {}) => ({
    ...styles,
    color: "white",
    ...dot(),
  }),
};
const DropDown = (props: Props) => {
  const { selectedOption, setSelectedOption } = props;
  const { notebooks } = useTheme();
  const [options, setOptions] = useState<ColourOption[]>([]);
  const handleChange = (
    newValue: SingleValue<ColourOption> | MultiValue<ColourOption>
  ) => {
    if (newValue && !Array.isArray(newValue)) {
      setSelectedOption(newValue as unknown as selectedOption);
    } else {
      setSelectedOption(undefined);
    }
  };
  useEffect(() => {
    const books = notebooks.map((book: book) => ({
      ...book,
      label: book.name,
    }));
    console.log(books);
    setOptions(books);
  }, [notebooks]);

  return (
    <div className="flex justify-center mb-[4px]">
      <Select
        options={options}
        value={selectedOption}
        onChange={handleChange}
        styles={colourStyles}
      ></Select>
    </div>
  );
};

export default DropDown;
