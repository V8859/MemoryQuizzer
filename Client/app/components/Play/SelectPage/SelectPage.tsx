"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import DeckList from "./DeckList";
import DeckWarning from "./DeckWarning";
import { NotebookObject, NoteObject } from "@/app/Types/NoteTypes";

type Props = {
  setPlayMode: Dispatch<SetStateAction<boolean>>;
  setCards: Dispatch<SetStateAction<NoteObject[]>>;
  playMode: boolean;
  setDecks: Dispatch<SetStateAction<NotebookObject[]>>;
  decks: NotebookObject[];
  setDeckName: Dispatch<SetStateAction<string>>;
};

const SelectPage = (props: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [warning, setWarning] = useState(false);
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
