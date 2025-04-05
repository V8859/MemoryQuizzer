import Urls from "./urls";
import { guestMode } from "../context/DataContext";
import { getDB, updateDB } from "../GuestMode/DB";

type note = {
  question: string;
  id: string;
  tag: string;
  link: string;
  answer: string;
};

type notes = [note];

export const fetchNotes = async (
  setData: any,
  noteId: any,
  updateR?: Function
) => {
  setData([]);

  const payload = { id: noteId };
  if (guestMode) {
    const DB = await getDB();
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
  async function mutateNotes(obj) {
    const arr = Object.values(obj);
    return arr;
  }
};

export const saveNotes = async (payload: any) => {
  if (guestMode) {
    const DB = await getDB();
    const noteIndex = findNoteList(DB?.notes, payload.id);
    const tagConflict = await verifyConflictingTags(payload.notes, DB);
    if (tagConflict) {
      await updateDB(DB);
      return { answer: "FAILED" };
    } else {
      if (noteIndex !== null) {
        const NoteList = DB?.notes[noteIndex];
        NoteList.notes = payload.notes;
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
        return response;
      }
    } catch (err) {
      console.error(err);
    }
  }
};

function findNoteList(notelist: any, NotebookId: string) {
  for (let index = 0; index < notelist.length; index++) {
    if (notelist[index].id === NotebookId) {
      return index;
    }
  }
  return null;
}

export async function extractAllNotesFromDB(): Array {
  const DB = await getDB();
  const notesWithTags: any = [];
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

async function verifyConflictingTags(notes: any, DB): boolean {
  console.log("CALLER");
  const notesWithTags: any = await extractAllNotesFromDB();
  console.log(notesWithTags);
  let nnotes = Object.values(notes);

  for (let i = 0; i < nnotes.length; i++) {
    console.log("IM IN HERE HELP!", notesWithTags.length);
    for (let j = 0; j < notesWithTags.length; j++) {
      console.log(notes[i].tag, "===", notesWithTags[j].tag);
      if (notes[i].tag === notesWithTags[j].tag) {
        console.log("Hmmm what");
        if (!(notes[i].id === notesWithTags[j].id)) {
          return true;
        }
      }
    }
  }
  return false;
}

function Hello(zzz) {
  console.log("HELLO", zzz);
}

async function tryCatch(anyFunction: Function) {
  try {
    const yes = await anyFunction();
    return yes;
  } catch (err) {
    console.log(err);
    return err;
  }
}
