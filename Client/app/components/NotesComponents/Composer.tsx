"use client";
import React, { SetStateAction, useState } from "react";
import NoteList from "./NoteList";
import Notebooks from "./notebook/Notebooks";
import { deleteNotebook } from "@/app/scripts/notebook";
import { useTheme } from "@/app/context/ThemeContext";
import { guestMode, useData } from "@/app/context/DataContext";
type NoteType = {
  id: string;
  createdAt?: string | Date;
  score?: number;
  notebookId?: string;
  question: string;
  answer: string;
  tag: string;
};
type payload = {
  id: string;
};

export const Composer = () => {
  const [noteId, setNoteId] = useState("");
  const [payload, setPayload] = useState<payload | undefined>();
  const { notebooks, setNotebooks, setNotebooksChanged } = useTheme();
  const [notebookName, setNotebookName] = useState("");
  const [modal, setModal] = useState(false);
  const [data, setData] = useState<NoteType[]>([]);
  const [refetch, setRefetch] = useState(Boolean);
  return (
    <div className="Composer md:flex-row">
      {modal ? (
        <DeleteConfirmation
          setModal={setModal}
          SetRefetch={setRefetch}
          setNotebooksChanged={setNotebooksChanged}
          setChange={setNotebooks}
          setNotebookName={setNotebookName}
          payload={payload}
        ></DeleteConfirmation>
      ) : (
        <>
          <NoteList
            data={data}
            setData={setData}
            refetch={refetch}
            notebookName={notebookName}
            setNobookName={setNotebookName}
            noteId={noteId}
          ></NoteList>
          <Notebooks
            setModal={setModal}
            setNotebookName={setNotebookName}
            setNoteId={setNoteId}
            notebooks={notebooks}
            setPayload={setPayload}
          ></Notebooks>
        </>
      )}
    </div>
  );
};

const DeleteConfirmation = ({
  setModal,
  SetRefetch,
  setData,
  setChange,
  setNotebookName,
  payload,
  setNotebooksChanged,
}: {
  SetRefetch: React.Dispatch<SetStateAction<boolean>>;
  setModal: (prev: boolean) => void;
  setData: React.Dispatch<SetStateAction<never[]>>;
  setChange: React.Dispatch<SetStateAction<never[]>>;
  setNotebookName: React.Dispatch<SetStateAction<string>>;
  setNotebooksChanged: React.Dispatch<SetStateAction<number>>;
  payload: payload;
}) => {
  const { toggleNoteList } = useData();
  return (
    <div className="w-full top-0 left-0 h-full fixed z-50 bg-gray-900 opacity-75 overflow-hidden">
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col gap-5">
          <div className="text-white">
            Are you sure you want to delete this notebook? All the notes inside
            will be deleted
          </div>
          <div className="flex">
            <button
              className="ModalButton"
              onClick={() => {
                setModal(false);
                setData([]);
              }}
            >
              No
            </button>
            <button
              className="ModalButton"
              onClick={async () => {
                setModal(false);
                try {
                  let response;
                  let checker;
                  if (!guestMode) {
                    response = await deleteNotebook(payload);
                    checker = await response.json();
                  } else {
                    response = await deleteNotebook(payload);
                    checker = response.message;
                  }

                  if (checker === "success") {
                    setChange([]);
                    setNotebookName("SELECT NOTEBOOK");
                    SetRefetch((prev) => !prev);
                    toggleNoteList();
                    setNotebooksChanged((prevChange: number) => prevChange + 1);
                  } else {
                    setChange((prevChange: number) => prevChange + 1);
                  }
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
