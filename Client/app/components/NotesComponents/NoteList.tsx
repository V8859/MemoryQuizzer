"use client";
import React, { SetStateAction, useEffect, useMemo } from "react";
import { fetchNotes, saveNotes } from "@/app/scripts/notes";
import { CirclePlus, Save } from "lucide-react";
import PageHeader from "../General/PageHeader";
import { useTheme } from "@/app/context/ThemeContext";
import Note from "./Note/Note";
import NotebookName from "./notebook/NotebookName";
import { guestMode, useData } from "@/app/context/DataContext";
import { v4 as uuid } from "uuid";
import { NoteObject } from "@/app/Types/NoteTypes";

type NotesIterator = {
  [noteId: string]: NoteObject;
};

export const NoteList = ({
  noteId,
  refetch,
  notebookName,
  data,
  setData,
}: {
  refetch: boolean;
  data: NoteObject[];
  setData: React.Dispatch<SetStateAction<NoteObject[]>>;
  noteId: string | undefined;
  notebookName: string;
  setNobookName: React.Dispatch<SetStateAction<string>>;
}) => {
  const { setNotebooks } = useTheme();

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
  }, [noteId, refetch, noteListFlag, setData]);

  useMemo(async () => {
    if (guestMode) {
      const fetchedNotes = await fetchNotes(setData, noteId);
      return fetchedNotes;
    }
  }, [noteId, refetch, setData]);

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
      const notes: NotesIterator = {};
      for (const [key, value] of formData.entries()) {
        const [noteId, field] = key.split("_");
        console.log(noteId, field);
        if (!notes[noteId]) {
          notes[noteId] = {
            question: "",
            answer: "",
            tag: "",
            id: "",
            link: "",
            score: 0,
            createdAt: "",
            notebookId: "",
          };
        }
        if (
          field === "question" ||
          field === "answer" ||
          field === "tag" ||
          field === "link" ||
          field === "notebookId"
        ) {
          notes[noteId][field] = String(value);
        }
      }
      let Iterator = 0;
      for (const key in notes) {
        console.log(notes);
        notes[key].id = data[Iterator].id;
        notes[key].score = data[Iterator].score;
        if (guestMode) {
          notes[key].createdAt = String(data[Iterator].createdAt);
          notes[key].notebookId = noteId;
        }
        Iterator++;
      }
      const notesArray: NoteObject[] = Object.values(notes).map((note) => {
        return {
          id: note.id as string,
          question: note.question as string,
          answer: note.answer as string,
          tag: note.tag as string,
          link: note.link as string,
          score: note.score as number,
          createdAt: note.createdAt as string,
          notebookId: note.notebookId as string,
        };
      });
      const payload = {
        notes: notesArray,
        id: noteId,
        userId: localStorage.getItem("userId"),
      };
      // console.log("Saving:", payload);
      try {
        const response = await saveNotes(payload);
        if (response) {
          if (!guestMode) {
            const sanData = response;
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
          notebookId: "",
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
          notebookId: "",
          createdAt: "",
          score: 0,
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

      setData((prevData: NoteObject[]) => {
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
            {/* {Object.keys(data).map((key) => (
              <li key={key}>
                <Note
                  Content={data[key]}
                  identifier={key}
                  noteId={data.id}
                ></Note>
              </li>
            ))} */}
            {data.map((note) => (
              <li key={note.id}>
                <Note
                  Content={note}
                  identifier={note.id}
                  noteId={noteId}
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
