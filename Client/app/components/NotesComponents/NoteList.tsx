"use client";
import React, { useEffect, useState } from "react";
import { fetchNotes, saveNotes } from "@/app/scripts/notes";
import { CirclePlus, Save } from "lucide-react";
import PageHeader from "../PageHeader";
import { useTheme } from "@/app/context/ThemeContext";
import Note from "./Note/Note";
import NotebookName from "./notebook/NotebookName";

export const NoteList = ({
  noteId,
  data,
  setData,
  notebookName,
}: {
  noteId: string | undefined;
  data: any;
  setData: any;
  notebookName: string;
  setNobookName: Function;
}) => {
  const { notebooks, setNotebooks } = useTheme();
  const [update, setUpdate] = useState(false);
  useEffect(() => {
    if (noteId) {
      fetchNotes(setData, noteId);
    }
  }, [noteId, update]);

  async function handleSubmit(e: any) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const notes: any = {};
    for (let [key, value] of formData.entries()) {
      const [noteId, field] = key.split("_");
      if (!notes[noteId]) {
        notes[noteId] = {};
      }
      notes[noteId][field] = value;
    }
    for (let key in data) {
      notes[key].id = data[key].id;
    }
    const payload = {
      notes: notes,
      id: noteId,
      userId: localStorage.getItem("userId"),
    };
    console.log("Saving:", payload);
    try {
      const response = await saveNotes(payload);
      if (response) {
        const sanData = await response.json();
        setUpdate(!update);
      }
      // console.log("save response: ", sanData);
    } catch (err) {
      console.log(err);
    }
  }
  async function addNote(e: any) {
    e.preventDefault();
    const skeleton = {
      question: "TEST",
      answer: "",
      link: "",
      tag: "",
      id: "",
    };
    const payload = {
      notes: skeleton,
      id: noteId,
      userId: localStorage.getItem("userId"),
    };
    setData((prevData: any) => {
      const updatedData = [...prevData, skeleton];
      console.log(updatedData);
      return updatedData;
    });
  }

  return (
    <>
      <div className="NoteArea">
        <div className="sticky top-0">
          <PageHeader
            title="Dashboard"
            href="/"
            message={
              notebookName.length > 0 ? (
                <NotebookName
                  notebookName={notebookName}
                  setNotebooks={setNotebooks}
                  noteId={noteId}
                />
              ) : (
                "SELECT BOOK"
              )
            }
          ></PageHeader>
        </div>
        <form
          className="flex flex-col items-center w-[100%]"
          id="SavingForm"
          method="post"
          onSubmit={handleSubmit}
        >
          <ul className="w-full px-0 md:px-11">
            {Object.keys(data).map((key) => (
              <li key={key}>
                <Note
                  Content={data[key]}
                  identifier={key}
                  noteId={data.id}
                ></Note>
              </li>
            ))}
          </ul>
        </form>
        <form id="AddingForm" onSubmit={addNote} method="post"></form>
        <div className="flex flex-col items-center">
          <div className="flex gap-4">
            <button form="AddingForm" className="NoteButtons" type="submit">
              <CirclePlus></CirclePlus>
            </button>
            <button className="NoteButtons" form="SavingForm" type="submit">
              <Save></Save>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoteList;
