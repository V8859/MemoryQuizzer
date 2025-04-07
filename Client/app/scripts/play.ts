import { guestMode } from "../context/DataContext";
import { getDB, updateDB } from "../GuestMode/DB";
import {
  DBType,
  GamePayload,
  NotebookData,
  NoteData,
  NoteObject,
} from "../Types/NoteTypes";
import { extractAllNotesFromDB } from "./notes";
import Urls from "./urls";

async function getPlayDeck(id: string) {
  //   const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!guestMode) {
    const url = new URL(Urls.playDeck);
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
  } else {
    const playDeck: NoteObject[] = [];
    const allNotes = await extractAllNotesFromDB();
    const firstNote = [...allNotes].filter((elemeent) => elemeent.id === id)[0];
    playDeck.push(firstNote);
    const visited: Set<string> = new Set();
    visited.add(firstNote.tag);
    findNextCard(allNotes, firstNote.tag, playDeck, visited);
    console.log(playDeck);
    return playDeck;
  }
}

async function saveGameScores(data: GamePayload) {
  if (guestMode) {
    const DB = await getDB();
    data.gameResult.date = new Date().toISOString();
    DB?.gameScores.push(data.gameResult);
    updateNotebookScores(data.notebooks.notebookData, DB);
    updateNoteScores(data.notes, DB);
    await updateDB(DB);
  } else {
    try {
      const response = await fetch(Urls.saveGame, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response) {
        return response;
      }
    } catch (err) {
      console.error(err);
    }
  }
}

async function getGameScores(data: string | null) {
  if (guestMode) {
    const DB = await getDB();
    if (DB) {
      return DB?.gameScores;
    } else {
      return { error: "no game scores found" };
    }
  } else {
    const url = new URL(Urls.getGameScores);
    if (data) url.searchParams.append("id", data);
    try {
      const response = await fetch(url.toString(), {
        method: "GET",
      });
      const rData = await response.json();
      console.log(rData);
      return rData;
    } catch (err) {
      console.error(err);
    }
  }
}

function findNextCard(
  notes: [],
  tag: string,
  playDeck: NoteObject[],
  visited: Set<string>
) {
  let notez: NoteObject[] = JSON.parse(JSON.stringify(notes));
  notez = notez.filter((element) => element.link === tag);
  if (notez.length <= 0) {
    return;
  }

  let minScore = notez[0].score;
  notez.forEach((element) => {
    if (element.score < minScore) {
      minScore = element.score;
    }
  });

  notez = notez.filter((element) => element.score === minScore);
  const next = selectCardFromList(notez);
  if (next)
    if (visited.has(next.tag)) {
      return;
    }
  if (next) {
    playDeck.push(next);
    visited.add(next.tag);
  }
  if (next) {
    findNextCard(notes, next.tag, playDeck, visited);
  }
  return playDeck;
}

function selectCardFromList(notes: NoteObject[]) {
  const length = notes.length;
  if (length === 0) return null;
  if (length === 1) return notes[0];
  const random = Math.floor(Math.random() * length);
  return notes[random];
}

function updateNotebookScores(notebookScores: NotebookData, DB: DBType) {
  if (DB) {
    for (let i = 0; i < DB?.notebooks.length; i++) {
      const notebookZ = Object.entries(notebookScores).map(([key, value]) => ({
        key,
        value,
      }));
      for (let j = 0; j < notebookZ.length; j++) {
        if (DB?.notebooks[i].id === notebookZ[j].key) {
          DB.notebooks[i].score += notebookZ[j].value;
        }
      }
    }
  }

  return DB;
}

function updateNoteScores(noteScores: { noteData: NoteData }, DB: DBType) {
  const data = noteScores.noteData;

  const notez = Object.entries(data).map(([key, value], index) => ({
    index,
    id: key,
    value,
  }));
  if (DB) {
    for (let i = 0; i < DB?.notes.length; i++) {
      const subNotes = Object.values(DB?.notes[i].notes);
      for (let n = 0; n < subNotes.length; n++) {
        for (let j = 0; j < notez.length; j++) {
          if (subNotes[n].id === notez[j].id) {
            subNotes[n].score += notez[j].value;
          }
        }
      }
    }
  }
  return DB;
}

export { getPlayDeck, saveGameScores, getGameScores };
