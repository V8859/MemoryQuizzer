"use client";
import React, { SetStateAction, useEffect, useMemo, useState } from "react";
import { fetchNotes, saveNotes } from "@/app/scripts/notes";
import { CirclePlus, Save } from "lucide-react";
import PageHeader from "../PageHeader";
import { useTheme } from "@/app/context/ThemeContext";
import Note from "./Note/Note";
import NotebookName from "./notebook/NotebookName";
import { guestMode, useData } from "@/app/context/DataContext";
import { v4 as uuid } from "uuid";
type NoteType = {
  id: string;
  createdAt?: string | Date;
  score?: number;
  notebookId?: string;
  question: string;
  answer: string;
  tag: string;
};
type Notes = Record<string, NoteType>;

export const NoteList = ({
  noteId,
  notebookName,
}: {
  noteId: string | undefined;
  notebookName: string;
  setNobookName: React.Dispatch<SetStateAction<string>>;
}) => {
  const { setNotebooks } = useTheme();
  const [data, setData] = useState<NoteType[]>([]);
  const { noteListFlag, toggleNoteList, toggleAlert } = useData();
  useEffect(() => {
    const noteFetcher = async () => {
      try {
        if (noteId) {
          if (!guestMode) {
            await fetchNotes(setData, noteId);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (!guestMode) {
      noteFetcher();
    }
  }, [noteId, noteListFlag, notebookName]);

  useMemo(async () => {
    if (guestMode) {
      const fetchedNotes = await fetchNotes(setData, noteId);
      return fetchedNotes;
    }
  }, [noteId]);

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (
      noteId === "" ||
      noteId === undefined ||
      notebookName === "SELECT BOOK"
    ) {
      return;
    } else {
      // Prevent the browser from reloading the page
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const notes: Notes = {};
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
        const [noteId, field]: string[] = key.split("_");
        if (!notes[noteId]) {
          notes[noteId] = {};
        }
        notes[noteId][field] = value;
      }
      for (const key in data) {
        notes[key].id = data[key].id;
        notes[key].score = data[key].score;
        if (guestMode) {
          notes[key].createdAt = data[key].createdAt;
          notes[key].notebookId = noteId;
        }
      }
      const payload = {
        notes: notes,
        id: noteId,
        userId: localStorage.getItem("userId"),
      };
      // console.log("Saving:", payload);
      try {
        const response = await saveNotes(payload);
        if (response) {
          if (!guestMode) {
            const sanData = await response.json();
            if (sanData.answer === "FAILED") {
              toggleAlert("Failed to save, check your tags", true);
            } else {
              toggleAlert("Saved Successfully", true);
              toggleNoteList();
            }
          }
          if (guestMode) {
            if (response.answer === "FAILED") {
              toggleAlert("Failed to save, check your tags", true);
            } else {
              toggleAlert("Saved Successfully", true);
              toggleNoteList();
            }
          }
        }
        // console.log("save response: ", sanData);
      } catch (err) {
        console.log(err);
      }
    }
  }
  async function addNote(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    if (noteId === "" || noteId === undefined) {
      return;
    } else {
      let skeleton;
      if (guestMode) {
        skeleton = {
          question: "",
          answer: "",
          link: "",
          tag: "",
          id: uuid(),
          createdAt: new Date().toISOString(),
          score: 0,
        };
      } else {
        skeleton = {
          question: "",
          answer: "",
          link: "",
          tag: "",
          id: "",
        };
      }

      // let payload;
      // if (!guestMode) {
      //   payload = {
      //     notes: skeleton,
      //     id: noteId,
      //     userId: localStorage.getItem("userId"),
      //   };
      // } else {
      //   payload = {
      //     notes: skeleton,
      //     id: noteId,
      //   };
      // }

      setData((prevData: NoteType[]) => {
        const updatedData = [...prevData, skeleton];
        return updatedData;
      });
    }
  }

  return (
    <>
      <div className="NoteArea">
        <div className="sticky top-0 z-30">
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
            <button
              title="Add"
              form="AddingForm"
              className="NoteButtons"
              type="submit"
            >
              <CirclePlus></CirclePlus>
            </button>
            <button
              title="Save"
              className="NoteButtons"
              form="SavingForm"
              type="submit"
            >
              <Save></Save>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoteList;
