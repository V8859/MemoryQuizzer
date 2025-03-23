const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const Urls = {
  user: baseUrl + "user/id",
  getNotebooks: baseUrl + "notebooks",
  getNotebooksForPlay: baseUrl + "notebooksWithLength",
  addNotebook: baseUrl + "notebooks/add",
  getNotes: baseUrl + "notebook/notes",
  saveNotes: baseUrl + "notes/save",
  playDeck: baseUrl + "playDeck",
  saveGame: baseUrl + "saveGame",
  getGameScores: baseUrl + "latestGame",
  deleteNotebook: baseUrl + "notebook/delete",
};

export default Urls;
