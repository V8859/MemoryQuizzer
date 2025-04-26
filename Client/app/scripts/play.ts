import { v4 as uuid } from "uuid";
import { guestMode } from "../context/DataContext";
import { getDB } from "../GuestMode/DB";
import {
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
      // console.log(data);
      return data; // Assuming data is an array of notebooks
    } catch (error) {
      console.error("Error:", error);
      return []; // Return an empty array in case of error
    }
  } else {
    // console.log("I WAS CALLED?");
    const playDeck: NoteObject[] = [];
    const allNotes = await extractAllNotesFromDB();
    const firstNote = allNotes?.filter((element, index) => {
      if (element.id === id) {
        allNotes.splice(index, 1);
        return element;
      }
    })[0];
    if (firstNote) {
      playDeck.push(firstNote);
      const visited: Set<string> = new Set();
      visited.add(firstNote.tag);
      findNextCard(allNotes, firstNote.tag, playDeck, visited);
      // console.log(playDeck);
      return playDeck;
    }
  }
}

async function saveGameScores(data: GamePayload) {
  data.gameResult.id = uuid();
  if (guestMode) {
    const DB = await getDB();
    data.gameResult.date = new Date().toISOString();
    await DB?.gameScores.add(data.gameResult);
    await updateNotebookScores(data.notebooks.notebookData);
    await updateNoteScores(data.notes);
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
    return await DB.gameScores.orderBy("date").reverse().toArray();
  } else {
    const url = new URL(Urls.getGameScores);
    if (data) url.searchParams.append("id", data);
    try {
      const response = await fetch(url.toString(), {
        method: "GET",
      });
      const rData = await response.json();
      // console.log(rData);
      return rData;
    } catch (err) {
      console.error(err);
    }
  }
}

function findNextCard(
  notes: NoteObject[],
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
      // console.log(visited, "AND ", next);

      return;
    }

  if (next) {
    playDeck.push(next);
    // console.log("ADDED");
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

async function updateNotebookScores(notebookScores: NotebookData) {
  const DB = await getDB();
  for (const notebook in notebookScores) {
    if (DB) {
      await DB.notebooks.update(notebook, (item) => {
        item.score += notebookScores[notebook];
      });
    }
  }
}

async function updateNoteScores(noteScores: { noteData: NoteData }) {
  const data = noteScores.noteData;
  // console.log(data);
  const DB = await getDB();
  for (const note in data) {
    await DB.notes.update(note, (item) => {
      item.score += data[note];
    });
  }
}

export { getGameScores, getPlayDeck, saveGameScores };
