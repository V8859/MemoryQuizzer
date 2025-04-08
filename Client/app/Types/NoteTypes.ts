export type gameScore = {
  gameScore: number;
  nameOfDeck: string;
  noOfCards: number;
  date: string;
};

export type NoteObject = {
  answer: string;
  createdAt: string;
  id: string;
  link: string;
  notebookId: string;
  question: string;
  score: number;
  tag: string;
  userId?: string;
};

export type NotebookObject = {
  createdAt: string;
  id: string;
  name: string;
  score: number;
  notes?: NoteObject[];
};

export type Note = {
  id: string;
  userId: null | string;
  notes: NoteObject[];
};

export type DBType =
  | {
      notebooks: NotebookObject[];
      notes: Note[];
      gameScores: gameScore[];
    }
  | undefined;

export type storedDataType = string | null;

export type GamePayload = {
  notes: GameNotes;
  notebooks: GameNotebooks;
  gameResult: GameResult;
};
export type GameResult = {
  date: string;
  id: string | undefined;
  nameOfDeck: string;
  noOfCards: number;
  gameScore: number;
};

export type GameNotes = {
  noteData: NoteData;
};

export type GameNotebooks = {
  notebookData: NotebookData;
};

export interface NoteData {
  [key: string]: number;
}

export interface NotebookData {
  [key: string]: number;
}

interface extra {}
