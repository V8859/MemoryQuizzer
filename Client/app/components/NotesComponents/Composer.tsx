"use client";
import React, { useState } from "react";
import NoteList from "./NoteList";
import Notebooks from "./notebook/Notebooks";
import { deleteNotebook } from "@/app/scripts/notebook";

export const Composer = () => {
  const [noteId, setNoteId] = useState();
  const [payload, setPayload] = useState();
  const [data, setData] = useState([]);
  const [notebookName, setNotebookName] = useState("");
  const [modal, setModal] = useState(false);
  const [change, setChange] = useState();
  return (
    <div className="Composer md:flex-row">
      {modal ? (
        <DeleteConfirmation
          setModal={setModal}
          setData={setData}
          setChange={setChange}
          setNotebookName={setNotebookName}
          payload={payload}
        ></DeleteConfirmation>
      ) : (
        <>
          <NoteList
            notebookName={notebookName}
            noteId={noteId}
            data={data}
            setData={setData}
          ></NoteList>
          <Notebooks
            setModal={setModal}
            setNotebookName={setNotebookName}
            setNoteId={setNoteId}
            setData={setData}
            setChange={setChange}
            change={change}
            setPayload={setPayload}
          ></Notebooks>
        </>
      )}
    </div>
  );
};

const DeleteConfirmation = ({
  setModal,
  setData,
  setChange,
  setNotebookName,
  payload,
}: {
  setModal: Function;
  setData: Function;
  setChange: Function;
  setNotebookName: Function;
  payload: any;
}) => {
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
              }}
            >
              No
            </button>
            <button
              className="ModalButton"
              onClick={async () => {
                setModal(false);

                try {
                  const response = await deleteNotebook(payload);
                  const checker = await response.json();
                  if (checker === "success") {
                    setData([]);
                    setChange(change + 1);
                    setNotebookName("SELECT NOTEBOOK");
                  } else {
                    setChange(change + 1);
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
