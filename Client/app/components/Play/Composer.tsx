"use client";
import React, { useEffect, useState } from "react";
import SelectPage from "./SelectPage/SelectPage";
import PlayPage from "./PlayPage/PlayPage";
import PageHeader from "../PageHeader";
import Alert from "../Alert";
import { useData } from "@/app/context/DataContext";

type Props = {};

const Composer = (props: Props) => {
  const [playMode, setPlayMode] = useState(false);
  const [cards, setCards] = useState([]);
  const [decks, setDecks] = useState([]);
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
