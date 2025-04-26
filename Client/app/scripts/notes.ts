import { Dispatch, SetStateAction } from "react";
import { guestMode } from "../context/DataContext";
import { getDB } from "../GuestMode/DB";
import { NoteObject } from "../Types/NoteTypes";
import Urls from "./urls";

export const fetchNotes = async (
  notebookId: string | undefined,
  setData?: Dispatch<SetStateAction<NoteObject[]>>
) => {
  if (setData) setData([]);

  const payload = { id: notebookId };
  if (guestMode) {
    const DB = await getDB();
    if (DB) {
      if (payload.id) {
        const notes = await DB.notes
          .where("notebookId")
          .equals(payload.id)
          .sortBy("createdAt");
        if (notes) {
          if (setData) {
            setData(notes);
          }
          return notes;
        }
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
      if (setData) {
        setData(data.notes);
      }
    } catch (err) {
      console.error(err);
    }
  }
  // async function mutateNotes(obj: NoteObject[]) {
  //   const arr = Object.values(obj);
  //   return arr;
  // }
};
type savePayload = {
  notes: NoteObject[];
  id: string;
  userId: string | null;
};

// type Note = {
//   id: string;
//   userId: null | string;
//   notes: NoteObject[];
// };

export const saveNotes = async (payload: savePayload) => {
  if (guestMode) {
    const DB = await getDB();
    // console.log(payload);
    // const noteIndex = findNoteList(DB?.notes, payload.id);
    const tagConflict = await verifyConflictingTags(payload.notes);
    if (tagConflict) {
      return { answer: "FAILED" };
    } else {
      payload.notes.forEach(async (note) => {
        const curr = await DB.notes.get(note.id);
        if (curr) {
          await DB.notes.update(curr.id, note);
        } else {
          await DB.notes.add(note);
        }
      });

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

// function findNoteList(notelist: Note[] | undefined, NotebookId: string) {
//   if (notelist) {
//     for (let index = 0; index < notelist.length; index++) {
//       if (notelist[index].id === NotebookId) {
//         return index;
//       }
//     }
//   }
//   return null;
// }

export async function extractAllNotesFromDB() {
  const DB = await getDB();
  if (DB) {
    const notes = await DB.notes.toArray();
    return notes;
  }
}

async function verifyConflictingTags(
  notes: NoteObject[] | undefined
): Promise<boolean> {
  // console.log("CALLER");
  const notesWithTags = await extractAllNotesFromDB();
  if (notesWithTags)
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
