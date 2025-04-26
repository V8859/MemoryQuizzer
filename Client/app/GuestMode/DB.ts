import Dexie, { Table } from "dexie";
import {
  DBType,
  gameScore,
  NotebookObject,
  NoteObject,
} from "../Types/NoteTypes";

interface DB extends Dexie {
  notes: Table<NoteObject, string>;
  notebooks: Table<NotebookObject, string>;
  gameScores: Table<gameScore, string>;
}

export async function getDB() {
  const db = new Dexie("DB") as DB;

  db.version(1).stores({
    notes: "id, &tag, notebookId, userId",
    notebooks: "id, name",
    gameScores: "id, nameOfDeck, noOfCards, gameScore, date",
  });
  return db;
}

export async function updateDB(DB: DBType) {
  localStorage.setItem("DB", JSON.stringify(DB));
}
