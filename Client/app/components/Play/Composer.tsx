"use client";
import React, { useState } from "react";
import SelectPage from "./SelectPage/SelectPage";
import PlayPage from "./PlayPage/PlayPage";
import PageHeader from "../PageHeader";
import { NotebookObject, NoteObject } from "@/app/Types/NoteTypes";

const Composer = () => {
  const [playMode, setPlayMode] = useState(false);
  const [cards, setCards] = useState<NoteObject[]>([]);
  const [decks, setDecks] = useState<NotebookObject[]>([]);
  const [deckName, setDeckName] = useState("Select Deck");
  return (
    <div className="Composer">
      <div className="NoteArea">
        <PageHeader title="Dashboard" href="/" message={deckName}></PageHeader>
        {playMode ? (
          <PlayPage
            setPlayMode={setPlayMode}
            cards={cards}
            deckName={deckName}
            setDeckName={setDeckName}
          ></PlayPage>
        ) : (
          <SelectPage
            setDeckName={setDeckName}
            playMode={playMode}
            setPlayMode={setPlayMode}
            setCards={setCards}
            setDecks={setDecks}
            decks={decks}
          ></SelectPage>
        )}
      </div>
    </div>
  );
};

export default Composer;
