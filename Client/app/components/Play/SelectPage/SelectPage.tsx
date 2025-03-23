"use client";
import React, { useEffect, useState } from "react";
import DeckList from "./DeckList";
import DeckWarning from "./DeckWarning";

type Props = {
  setPlayMode: any;
  setCards: any;
  playMode: any;
  setDecks: Function;
  decks: any;
  setDeckName: Function;
};

const SelectPage = (props: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [warning, setWarning] = useState(false);
  const [warning2, setCloseWarning] = useState(warning);
  return (
    <div className="flex h-full overflow-x-hidden">
      <div className="PlayCardArea overflow-x-hidden">
        <div className="flex flex-col overflow-y-auto pt-1">
          <div className="w-full items-center flex mb-2 mt-2 hover:scale-y-105">
            <input
              placeholder="Search"
              className="PlayCardAreaSearchBox"
              value={searchTerm}
              type="text"
              onChange={(e) => setSearchTerm(e.target.value)}
            ></input>
          </div>
        </div>
        {warning ? (
          <div
            className={`flex w-full h-fit mt-3 mb-10 md:m-1 items-center justify-center relative ${
              warning ? "py-5 " : "py-0 "
            }`}
          >
            <DeckWarning setWarning={setWarning}></DeckWarning>
          </div>
        ) : (
          ""
        )}

        <DeckList
          setDeckName={props.setDeckName}
          playMode={props.playMode}
          setWarning={setWarning}
          setPlayMode={props.setPlayMode}
          searchTerm={searchTerm}
          setCards={props.setCards}
          setDecks={props.setDecks}
          decks={props.decks}
        ></DeckList>
      </div>
    </div>
  );
};

export default SelectPage;
