"use client";
import { useState, createContext, useContext, SetStateAction } from "react";

import React from "react";
export let guestMode: boolean = false;

type selectedOption =
  | {
    createdAt: string;
    id: string;
    label: string;
    name: string;
    score: number;
  }
  | undefined;

type Props = {
  guestMode: boolean;
  changeGuestMode: (current: boolean) => void;
  noteListFlag: boolean;
  toggleNoteList: () => void;
  showAlert: boolean;
  alertMessage: string;
  toggleAlert: (message: string, showIT?: boolean) => void;
  alertBool: boolean;
  createModal: boolean;
  addModal: boolean;
  setAddModal: React.Dispatch<React.SetStateAction<boolean>>
  setCreateModal: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedOption: React.Dispatch<SetStateAction<selectedOption>>
  selectedOption: selectedOption
};

const DataContext = createContext<Props | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [noteListFlag, setNoteListFlag] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertBool, setAlertBool] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [addModal, setAddModal] = useState(false)
  const [selectedOption, setSelectedOption] = useState<selectedOption>();


  const toggleNoteList = () => {
    // console.log("NoteList toggled");
    setNoteListFlag((prev) => !prev);
  };
  const toggleAlert = (message: string, showIT: boolean = true) => {
    setAlertMessage(message);
    setShowAlert((prev) => !prev);
    setAlertBool(showIT);
  };

  const changeGuestMode = (current: boolean) => {
    guestMode = current;
    // console.log("GuestMode", guestMode);
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
        createModal,
        addModal,
        setAddModal,
        setCreateModal,
        setSelectedOption,
        selectedOption
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
