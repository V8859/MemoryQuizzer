"use client";
import { useState, createContext, useContext, useRef } from "react";

import React from "react";
export let guestMode: boolean = false;

type Props = {
  guestMode: boolean;
  changeGuestMode: (current: boolean) => void;
  noteListFlag: boolean;
  toggleNoteList: Function;
  showAlert: boolean;
  alertMessage: string;
  toggleAlert: Function;
  alertBool: boolean;
};

const DataContext = createContext<Props | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [noteListFlag, setNoteListFlag] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertBool, setAlertBool] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const toggleNoteList = () => {
    setNoteListFlag((prev) => !prev);
  };
  const toggleAlert = (message, showIT) => {
    setAlertMessage(message);
    setShowAlert((prev) => !prev);
    setAlertBool(showIT);
  };

  const changeGuestMode = (current: boolean) => {
    guestMode = current;
    console.log("GuestMode", guestMode);
  };
  return (
    <DataContext.Provider
      value={{
        alertBool,
        guestMode,
        toggleAlert,
        changeGuestMode,
        noteListFlag,
        toggleNoteList,
        showAlert,
        alertMessage,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
