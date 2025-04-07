import Urls from "./urls";
import { guestMode } from "../context/DataContext";
import { getDB, updateDB } from "../GuestMode/DB";
import { Dispatch, SetStateAction } from "react";
import { NoteObject } from "../Types/NoteTypes";

export const fetchNotes = async (
  setData: Dispatch<SetStateAction<NoteObject[]>>,
  noteId: string | undefined
) => {
  setData([]);

  const payload = { id: noteId };
  if (guestMode) {
    const DB = await getDB();
    if (DB) {
      const notes = DB.notes.filter((note) => {
        return note.id === noteId;
      });
      if (notes.length > 0) {
        const obj = JSON.parse(JSON.stringify(notes[0].notes));
        const arr = await mutateNotes(obj);
        // setTimeout(() => setData(arr), 1);
        setData(arr);
        return arr;
      }
    }
  } else {
    try {
      const response = await fetch(Urls.getNotes, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setData(data.notes);
    } catch (err) {
      console.error(err);
    }
  }
  async function mutateNotes(obj: NoteObject[]) {
    const arr = Object.values(obj);
    return arr;
  }
};
type savePayload = {
  notes: NoteObject[];
  id: string;
  userId: string | null;
};

type Note = {
  id: string;
  userId: null | string;
  notes: NoteObject[];
};

export const saveNotes = async (payload: savePayload) => {
  if (guestMode) {
    const DB = await getDB();
    const noteIndex = findNoteList(DB?.notes, payload.id);
    const tagConflict = await verifyConflictingTags(payload.notes);
    if (tagConflict) {
      await updateDB(DB);
      return { answer: "FAILED" };
    } else {
      if (noteIndex !== null) {
        const NoteList: Note | undefined = DB?.notes[noteIndex];
        if (NoteList) {
          NoteList.notes = payload.notes;
        }
      } else {
        DB?.notes.push(payload);
      }
      await updateDB(DB);
      return { answer: "SUCCESS" };
    }
  } else {
    try {
      const response = await fetch(Urls.saveNotes, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response) {
        const res = await response.json();
        return res;
      }
    } catch (err) {
      console.error(err);
    }
  }
};

function findNoteList(notelist: Note[] | undefined, NotebookId: string) {
  if (notelist) {
    for (let index = 0; index < notelist.length; index++) {
      if (notelist[index].id === NotebookId) {
        return index;
      }
    }
  }
  return null;
}

export async function extractAllNotesFromDB() {
  const DB = await getDB();
  const notesWithTags: NoteObject[] = [];
  if (DB)
    for (let i = 0; i < DB.notes.length; i++) {
      Object.values(DB.notes[i].notes).forEach((element) => {
        notesWithTags.push({
          tag: element.tag,
          id: element.id,
          link: element.link,
          question: element.question,
          createdAt: element.createdAt,
          answer: element.answer,
          score: element.score,
          notebookId: element.notebookId,
        });
      });
    }
  return JSON.parse(JSON.stringify(notesWithTags));
}

async function verifyConflictingTags(
  notes: NoteObject[] | undefined
): Promise<boolean> {
  // console.log("CALLER");
  const notesWithTags: NoteObject[] = await extractAllNotesFromDB();
  console.log(notesWithTags);
  if (notes) {
    const nnotes = Object.values(notes);

    for (let i = 0; i < nnotes.length; i++) {
      // console.log("IM IN HERE HELP!", notesWithTags.length);
      for (let j = 0; j < notesWithTags.length; j++) {
        // console.log(notes[i].tag, "===", notesWithTags[j].tag);
        if (notes[i].tag === notesWithTags[j].tag) {
          // console.log("Hmmm what");
          if (!(notes[i].id === notesWithTags[j].id)) {
            return true;
          }
        }
      }
    }
  }
  return false;
}
