import React, { useState } from "react";
import { ArrowLeftToLine } from "lucide-react";
import FlashCarousel from "./PlayView/FlashCarousel";

type Props = {
  cards: [];
  setPlayMode: Function;
  deckName: string;
  setDeckName: Function;
};

const PlayPage = (props: Props) => {
  const [flipped, setFlipped] = useState(false);
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
      <FlashCarousel deckName={props.deckName} children={cards}></FlashCarousel>
    </div>
  );
};

export default PlayPage;
