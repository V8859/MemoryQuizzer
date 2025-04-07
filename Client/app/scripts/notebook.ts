import Urls from "./urls";
import { guestMode } from "../context/DataContext";
import { getDB, updateDB } from "../GuestMode/DB";
import { Note, NotebookObject, NoteObject } from "../Types/NoteTypes";

async function getNotebooks(id?: string | null) {
  if (guestMode) {
    const DB = await getDB();
    if (DB) {
      return DB.notebooks.length > 0 ? DB.notebooks : [];
    }
  } else {
    //   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = new URL(Urls.getNotebooks);
    if (id) {
      url.searchParams.append("id", id);
    }

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      // console.log(data); // Log the entire data object to inspect the structure
      return data; // Assuming data is an array of notebooks
    } catch (error) {
      console.error("Error:", error);
      return []; // Return an empty array in case of error
    }
  }
}

async function getNotebooksForPlay(id?: string) {
  if (guestMode) {
    const response: {
      books: unknown[];
      hidden: boolean;
    } = { books: [], hidden: false };
    const DB = await getDB();
    if (DB) {
      const notebooks: NotebookObject[] = DB.notebooks ? DB.notebooks : [];
      const notes: Note[] = DB.notes;
      notes.filter((element) => element?.notes.length > 3);
      const correctIds = notebooksWithMinLength(4, notes);
      if (correctIds.length !== notebooks.length) {
        response.hidden = true;
      }

      const map = new Map(
        notes.map((item: { id: string; notes: NoteObject[] }) => [
          item.id,
          item.notes,
        ])
      );
      const filteredArray: NotebookObject[] = Object.values(
        JSON.parse(JSON.stringify(notebooks)) as NotebookObject[]
      ).filter((item) => {
        if (correctIds.includes(item.id)) {
          return item;
        }
      });

      const mergedArray = filteredArray.map((item) => ({
        ...item,
        notes: map.get(item.id),
      }));

      if (filteredArray) {
        response.books = mergedArray;
      }
      return response;
    }
  } else {
    const url = new URL(Urls.getNotebooksForPlay);
    if (id) {
      url.searchParams.append("id", id);
    }

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      // console.log(data); // Log the entire data object to inspect the structure
      console.log(data);
      return data; // Assuming data is an array of notebooks
    } catch (error) {
      console.error("Error:", error);
      return []; // Return an empty array in case of error
    }
  }
}

type NotebookObjectGuest = {
  id: string;
  name: string;
  createdAt: string;
  score: number;
};

type NotebookObjectServer = {
  id: string;
  name: string;
};
async function addNotebook(
  payload: NotebookObjectGuest | NotebookObjectServer
) {
  if (guestMode) {
    const DB = await getDB();
    const payloadGuest = payload as NotebookObjectGuest;
    if (DB) {
      DB.notebooks.push(payloadGuest);
      await updateDB(DB);
      return { ok: true, notebooks: DB.notebooks };
    }
  } else {
    const payloadServer = payload as NotebookObjectServer;
    const response = await fetch(Urls.addNotebook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payloadServer),
    });
    const rez = await response.json();
    return rez;
  }
}

async function deleteNotebook(payload: { id: string }) {
  if (!guestMode) {
    const response = await fetch(Urls.deleteNotebook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const res = await response.json();
    return res;
  } else {
    const DB = await getDB();
    if (DB) {
      DB.notebooks = DB.notebooks.filter(
        (element: { id: string }) => element.id !== payload.id
      );
      console.log(DB?.notes);
      DB.notes = DB?.notes.filter(
        (element: { id: string }) => element.id !== payload.id
      );
      console.log(DB?.notes);
      await updateDB(DB);
      return { message: "success", data: DB.notebooks };
    }
  }
}

async function renameNotebook(payload: {
  name: string;
  id: string | undefined;
}) {
  if (guestMode) {
    const DB = await getDB();
    DB?.notebooks.forEach((element: { id: string; name: string }) => {
      if (element.id === payload.id) element.name = payload.name;
    });
    await updateDB(DB);
    return "success";
  } else {
    const response = await fetch(Urls.renameNotebook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await response.json();
  }
}
type notes = {
  id: string;
  notes: NoteObject[];
};

function notebooksWithMinLength(length: number, notes: notes[]) {
  const acceptableNotebooks = [];
  for (let i = 0; i < notes.length; i++) {
    if (Object.values(notes[i].notes).length >= length) {
      acceptableNotebooks.push(notes[i].id);
    }
  }
  return acceptableNotebooks;
}

export {
  getNotebooks,
  addNotebook,
  getNotebooksForPlay,
  deleteNotebook,
  renameNotebook,
};
