import React, { SetStateAction } from "react";
import { ArrowLeftToLine } from "lucide-react";
import FlashCarousel from "./PlayView/FlashCarousel";
import { NoteObject } from "@/app/Types/NoteTypes";

type Props = {
  cards: NoteObject[];
  setPlayMode: React.Dispatch<SetStateAction<boolean>>;
  deckName: string;
  setDeckName: React.Dispatch<SetStateAction<string>>;
};

const PlayPage = (props: Props) => {
  console.log(props.cards);
  const { cards } = props;
  return (
    <div className="flex flex-col h-full w-full">
      <div className="w-full">
        <button
          onClick={() => {
            props.setPlayMode(false);
            props.setDeckName("Select deck");
          }}
          className="px-3 py-3 flex rounded bg-inherit text-blue-400 hover:scale-105"
        >
          <ArrowLeftToLine />
          Back
        </button>
      </div>
      <FlashCarousel deckName={props.deckName} cards={cards}></FlashCarousel>
    </div>
  );
};

export default PlayPage;
