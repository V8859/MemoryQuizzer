"use client";

import { getNotebooksForPlay } from "@/app/scripts/notebook";
import React, { SetStateAction, useEffect } from "react";
import PlayCard from "./PlayCard";
import { guestMode } from "@/app/context/DataContext";

type Props = {
  searchTerm: string;
  setWarning: React.Dispatch<SetStateAction<boolean>>;
  setPlayMode: React.Dispatch<SetStateAction<boolean>>;
  setCards: React.Dispatch<SetStateAction<never[]>>;
  playMode: boolean;
  decks: never[];
  setDecks: React.Dispatch<SetStateAction<never[]>>;
  setDeckName: React.Dispatch<SetStateAction<string>>;
};

const DeckList = (props: Props) => {
  const { setDecks, setWarning, searchTerm, playMode, decks } = props;
  useEffect(() => {
    const fetchNotebooks = async () => {
      const userId = localStorage.getItem("userId");
      if (userId && !guestMode) {
        const books = await getNotebooksForPlay(userId);
        // console.log(books);
        setDecks(books.books);
        // console.log(books.hidden);
        setWarning(books.hidden);
        console.log("NO");
      }
      if (guestMode) {
        const books = await getNotebooksForPlay();
        setDecks(books.books);
        setWarning(books.hidden);
      }
    };
    fetchNotebooks();
  }, [playMode, setWarning, setDecks]);
  let filteredDecks = [];
  if (decks) {
    filteredDecks = props.decks.filter((ele: { name: string }) =>
      ele.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return (
    <div className="flex flex-wrap gap-6 items-center justify-center pb-1">
      {filteredDecks.map((ele: { id: string }) => (
        <div key={ele.id}>
          {
            <PlayCard
              setDeckName={props.setDeckName}
              setCards={props.setCards}
              setPlayMode={props.setPlayMode}
              data={ele}
            ></PlayCard>
          }
        </div>
      ))}
    </div>
  );
};

export default DeckList;
