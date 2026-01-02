"use client";
import { guestMode, useData } from "@/app/context/DataContext";
import { useTheme } from "@/app/context/ThemeContext";
import { fetchNotes, saveNotes } from "@/app/scripts/notes";
import { NoteObject } from "@/app/Types/NoteTypes";
import { CirclePlus, Save, Sparkles } from "lucide-react";
import React, { SetStateAction, useEffect } from "react";
import { v4 as uuid } from "uuid";
import PageHeader from "../General/PageHeader";
import Note from "./Note/Note";
import NotebookName from "./notebook/NotebookName";
import { exportNotebook, importNotebook } from "@/app/scripts/notebook";

// type selectedOption =
//   | {
//     createdAt: string;
//     id: string;
//     label: string;
//     name: string;
//     score: number;
//   }
//   | undefined;


type NotesIterator = {
  [noteId: string]: NoteObject;
};

export const NoteList = ({
  noteId,
  refetch,
  notebookName,
  data,
  setData,
  children
}: {
  refetch: boolean;
  data: NoteObject[];
  setData: React.Dispatch<SetStateAction<NoteObject[]>>;
  noteId: string | undefined;
  notebookName: string;
  setNobookName: React.Dispatch<SetStateAction<string>>;
  children: React.ReactElement[]
}) => {
  const { setNotebooks, notebooksChanged } = useTheme();
  const { toggleNoteList, toggleAlert, noteListFlag } = useData();
  useEffect(() => {
    const noteFetcher = async () => {
      try {
        if (noteId) {
          if (!guestMode) {
            await fetchNotes(noteId, setData);
          }
          const fetchedNotes = await fetchNotes(noteId);
          if (fetchedNotes) {
            setData(fetchedNotes);
            toggleNoteList();
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    noteFetcher();
  }, [noteId, refetch, setData, notebooksChanged]);

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
        // console.log(noteId, field);
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
        // console.log(notes);
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
      <div className="NoteArea flex-grow-[2]">
        <div className="sticky top-0 z-30">
          <PageHeader
            title="Dashboard"
            href="/"
            message=
            // {selectedOption?.name ?? "SELECT BOOK"}
            {
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
          >{children[0]}{<div className="relative flex z-10 h-10 flex-row gap-2 pr-2">
            <CreateWithGenButton />
            <AddNotebookButton />
            <ImportButton />
            {noteId && <ExportButton noteId={noteId}></ExportButton>}
            {children[1]}
          </div>}</PageHeader>
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


import { useRef } from "react";
// import DropDown from "../Decks/Dropdown";

function ImportButton() {
  const { setNotebooksChanged } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click(); // programmatically open dialog
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      console.log(text)
      const parsed = JSON.parse(text);

      // console.log("Parsed JSON:", parsed);

      // Call your import function with the parsed payload
      const an = await importNotebook(parsed);
      if (an === "SUCCESS") {
        setNotebooksChanged((prev) => prev + 1)

      }
    } catch (err) {
      console.error("Invalid JSON file", err);
    }
  };
  return (
    <>
      <button
        onClick={handleClick}
        className="WelcomeMessage group relative flex ease-in-out justify-start p-2 transition-all duration-300 mt-2 hover:-mt-2 rounded-t-xl"
      >
        Import
      </button>

      {/* Hidden file input */}
      <input
        type="file"
        title="upload notes"
        accept=".json"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />
    </>
  );
}

function ExportButton({ noteId: noteId }: { noteId: string }) {
  return (
    <button
      onClick={() => {
        exportNotebook(noteId)
      }}
      className="WelcomeMessage group relative flex ease-in-out justify-start p-2 transition-all duration-300 mt-2 hover:-mt-2 rounded-t-xl">Export
    </button>
  )
}

function CreateWithGenButton() {
  const { setCreateModal } = useData()
  return (
    <button
      onClick={() => {
        setCreateModal((prev) => !prev)
      }}
      className="WelcomeMessage items-start gap-1 group relative flex ease-in-out justify-start p-2 transition-all duration-300 mt-2 hover:-mt-2 rounded-t-xl">
      <span className="flex gap-1 items-center"> <Sparkles className="w-4 h-4 " />Generate with AI</span>
    </button>
  )
}

const AddNotebookButton = () => {
  const { setAddModal } = useData()
  return (
    <button
      onClick={() => {
        setAddModal((prev) => !prev)
      }}
      className="WelcomeMessage items-start gap-1 group relative flex ease-in-out justify-start p-2 transition-all duration-300 mt-2 hover:-mt-2 rounded-t-xl"
    >
      Add Notebook
    </button>
  )
}

