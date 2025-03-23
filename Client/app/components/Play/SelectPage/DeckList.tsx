"use client";

import { getNotebooksForPlay } from "@/app/scripts/notebook";
import React, { useEffect, useState } from "react";
import PlayCard from "./PlayCard";

type Props = {
  searchTerm: string;
  setWarning: any;
  setPlayMode: any;
  setCards: any;
  playMode: any;
  decks: any;
  setDecks: Function;
  setDeckName: Function;
};

const DeckList = (props: Props) => {
  const requiredDeckLength = 4;

  useEffect(() => {
    const fetchNotebooks = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const books = await getNotebooksForPlay(userId);
        console.log(books);
        props.setDecks(books.books);
        console.log(books.hidden);
        props.setWarning(books.hidden);
      }
    };
    fetchNotebooks();
  }, [props.playMode]);
  const filteredDecks = props.decks.filter((ele: any) =>
    ele.name.toLowerCase().includes(props.searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-wrap gap-6 items-center justify-center pb-1">
      {filteredDecks.map((ele: any) => (
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
