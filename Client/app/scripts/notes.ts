import Urls from "./urls";

export const fetchNotes = async (setData: any, noteId: any) => {
  const payload = { id: noteId };
  setData([]);
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
};

export const saveNotes = async (payload: any) => {
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
};
