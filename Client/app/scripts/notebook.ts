import { guestMode } from "../context/DataContext";
import { getDB } from "../GuestMode/DB";
import { fetchNotes, saveNotes } from "./notes";
import { v4 as uuid } from "uuid";
import Urls from "./urls";
import { NoteObject } from "../Types/NoteTypes";

async function getNotebooks(id?: string | null) {
  if (guestMode) {
    const DB = await getDB();
    if (DB) {
      return await DB.notebooks.toArray();
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
      const notebooks = await DB.notebooks.toArray();
      for (const element in notebooks) {
        const notes = await DB.notes
          .where("notebookId")
          .equals(notebooks[element].id)
          .toArray();
        if (notes.length > 0) {
          response.books.push(notebooks[element]);
        }
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
      // console.log(data);
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
      try {
        await DB.notebooks.add(payloadGuest);
        const notebooks = await DB.notebooks.toArray();
        return { ok: true, notebooks: notebooks };
      } catch (error) {
        console.error(error);
        return { ok: false, error: "FAILED" };
      }
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
      if (DB) {
        DB.notebooks.delete(payload.id);
        DB.notes.where("notebookId").equals(payload.id).delete();
      }
    }
    return { message: "success", data: await DB.notebooks.toArray() };
  }
}

async function renameNotebook(payload: {
  name: string;
  id: string | undefined;
}) {
  if (guestMode) {
    const DB = await getDB();
    if (payload.id) {
      const existingNotebook = await DB.notebooks.get(payload.id);
      if (!existingNotebook) {
        return { ok: false, error: "Notebook doesn't exist" };
      }
      await DB.notebooks.update(payload.id, { name: payload.name });
      return "success";
    }
  } else {
    const response = await fetch(Urls.renameNotebook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await response.json();
  }
}
// type notes = {
//   id: string;
//   notes: NoteObject[];
// };

// function notebooksWithMinLength(length: number, notes: notes[]) {
//   const acceptableNotebooks = [];
//   for (let i = 0; i < notes.length; i++) {
//     if (Object.values(notes[i].notes).length >= length) {
//       acceptableNotebooks.push(notes[i].id);
//     }
//   }
//   return acceptableNotebooks;
// }

async function exportNotebook(notebookId: string | undefined) {
  const db = await getDB();

  if (notebookId) {
    const notebook = await db.notebooks.get(notebookId);
    const notes = await fetchNotes(notebookId);

    const json = JSON.stringify({ notebook, notes }, null, 2);

    // Create a Blob with JSON content
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = `${notebook?.name}.json`; // filename
    a.click();

    // Clean up
    URL.revokeObjectURL(url);
  }
}

type savePayload = {
  notes: NoteObject[];
  notebook: NotebookObjectGuest
  id: string;
  userId: string;
};

async function importNotebook(payload: savePayload) {

  const notebookPayload = {
    id: uuid(),
    name: payload.notebook.name,
    createdAt: new Date().toISOString(),
    score: 0
  };

  // Normalize notes
  const normalizedNotes: NoteObject[] = [];
  let i = 0

  for (const note of payload.notes) {
    if (i < 3) {
      await new Promise(res => setTimeout(res, 200)); // 100ms delay
    }

    normalizedNotes.push({
      ...note,
      id: uuid(),
      notebookId: notebookPayload.id,
      createdAt: new Date().toISOString(),
      score: 0,
    });
    i++
  }
  payload.notes = normalizedNotes

  const an = await saveNotes(payload);
  if (an.answer === "SUCCESS") {
    await addNotebook(notebookPayload);
    return "SUCCESS"
  } else {
    return an.answer
  }

}

export {
  addNotebook,
  deleteNotebook,
  getNotebooks,
  getNotebooksForPlay,
  renameNotebook,
  exportNotebook,
  importNotebook,
};
