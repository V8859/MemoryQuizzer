"use client";
import { useData } from "@/app/context/DataContext";
import { useEffect } from "react";
type Props = {
  guest: boolean;
};

const SetGuestMode = (props: Props) => {
  const { changeGuestMode } = useData();
  const { guest } = props;

  useEffect(() => {
    if (guest) {
      changeGuestMode(true);
      initDb();
    } else {
      changeGuestMode(false);
      // clearDb();
    }
  }, [guest, changeGuestMode]);

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

// function clearDb() {
//   localStorage.setItem("DB", JSON.stringify([]));
// }
