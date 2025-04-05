import Urls from "./urls";
import { useData, guestMode } from "../context/DataContext";
import { getDB, updateDB } from "../GuestMode/DB";
import { extractAllNotesFromDB } from "./notes";

async function getNotebooks(id?: any) {
  if (guestMode) {
    const DB = await getDB();
    return DB.notebooks.length > 0 ? DB.notebooks : [];
  } else {
    //   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = new URL(Urls.getNotebooks);
    url.searchParams.append("id", id);

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
    const notebooks = DB.notebooks ? DB.notebooks : [];
    const notes = DB.notes;
    notes.filter((element) => {
      element.notes.length > 3;
    });
    const correctIds = notebooksWithMinLength(4, notes);
    if (correctIds.length !== notebooks.length) {
      response.hidden = true;
    }

    const map = new Map(notes.map((item) => [item.id, item.notes]));

    const filteredArray = Object.values(
      JSON.parse(JSON.stringify(notebooks))
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
  } else {
    const url = new URL(Urls.getNotebooksForPlay);
    url.searchParams.append("id", id);

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

async function addNotebook(payload: Object) {
  if (guestMode) {
    const DB: DBType | any = await getDB();
    DB.notebooks.push(payload);
    // console.log(DB.notebooks);
    await updateDB(DB);
    return { ok: true, notebooks: DB.notebooks };
  } else {
    const response = await fetch(Urls.addNotebook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response;
  }
}

async function deleteNotebook(payload: Object) {
  if (!guestMode) {
    const response = await fetch(Urls.deleteNotebook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response;
  } else {
    const DB = await getDB();
    DB.notebooks = DB.notebooks.filter((element) => element.id !== payload.id);
    console.log(DB?.notes);
    DB.notes = DB?.notes.filter((element) => element.id !== payload.id);
    console.log(DB?.notes);
    await updateDB(DB);
    return { message: "success", data: DB.notebooks };
  }
}

async function renameNotebook(payload: Object) {
  if (guestMode) {
    const DB = await getDB();
    DB?.notebooks.forEach((element) => {
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

function notebooksWithMinLength(length: number, notes: []) {
  let acceptableNotebooks = [];
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
