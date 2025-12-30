"use client";
import { useTheme } from "@/app/context/ThemeContext";
import { renameNotebook } from "@/app/scripts/notebook";
import { Check, PenIcon } from "lucide-react";
import React, { SetStateAction, useEffect, useState } from "react";

const NotebookName = ({
  notebookName,
  noteId,
}: {
  notebookName: string;
  noteId?: string;
  setNotebooks: React.Dispatch<SetStateAction<never[]>>;
}) => {
  useEffect(() => {
    setValue(notebookName);
  }, [notebookName]);

  const [inputMode, setInputMode] = useState(true);
  const [value, setValue] = useState(notebookName);
  const { setNotebooksChanged } = useTheme();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const handleUpdate = async () => {
    const payload = {
      id: noteId,
      name: value,
    };
    const response = await renameNotebook(payload);
    if (response === "success") {
      // console.log("SO IT WORKED?");
      setNotebooksChanged((prev: number) => prev + 1);
    } else {
      console.error("Notebook rename failed");
    }
  };
  return (
    <div className="flex items-center gap-5 justify-between">
      {inputMode ? (
        <h1>{value}</h1>
      ) : (
        <input
          className="w-[80%] outline-none bg-orange-300/100 rounded px-1 items-center text-red-950"
          value={value}
          maxLength={20}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setInputMode((prevState: boolean) => !prevState);
              handleUpdate();
            }
          }}
        ></input>
      )}
      {inputMode ? (
        <div
          className="cursor-pointer"
          onClick={() => {
            setInputMode((prevState: boolean) => !prevState);
          }}
        >
          <PenIcon></PenIcon>
        </div>
      ) : (
        <button
          title="Bt"
          className="cursor-pointer"
          onClick={() => {
            setInputMode((prevState: boolean) => !prevState);
            handleUpdate();
          }}
        >
          <Check></Check>
        </button>
      )}
    </div>
  );
};

export default NotebookName;
