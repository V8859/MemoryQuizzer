type DBType =
  | {
      notebooks: never[];
      notes: never[];
      gameScores: never[];
    }
  | undefined;

type storedDataType = string | null;

export async function getDB() {
  const storedData: storedDataType = localStorage.getItem("DB");
  if (storedData) {
    const DB: DBType = JSON.parse(storedData);
    return DB;
  } else {
    return;
  }
}

export async function updateDB(DB: DBType) {
  localStorage.setItem("DB", JSON.stringify(DB));
}
