"use client";
import { useData } from "@/app/context/DataContext";
type Props = {
  guest: boolean;
};

const SetGuestMode = (props: Props) => {
  const { changeGuestMode } = useData();
  const { guest } = props;

  guest ? changeGuestMode(true) : changeGuestMode(false);
  guest ? initDb() : "";
  return null;
};

export default SetGuestMode;

function initDb() {
  const DB = localStorage.getItem("DB");
  if (!DB) {
    localStorage.setItem(
      "DB",
      JSON.stringify({ notebooks: [], notes: [], gameScores: [] })
    );
  }
}

function clearDb() {
  localStorage.setItem("DB", JSON.stringify([]));
}
