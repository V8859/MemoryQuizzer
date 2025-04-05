"use client";
import { X } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";

type Props = {
  setWarning: Dispatch<SetStateAction<boolean>>;
};

const DeckWarning = (props: Props) => {
  const [styl, setStyl] = useState("DeckWarning");
  return (
    <div className={`${styl} absolute`}>
      Some Decks may be missing because they contain less than 4 cards.
      <div className="flex items-center">
        <X
          className="hover:scale-110 cursor-pointer md:w-auto md:h-auto w-[30px] h-[30px]"
          onClick={() => {
            setStyl("DeckWarningHide");
            props.setWarning(false);
          }}
        ></X>
      </div>
    </div>
  );
};

export default DeckWarning;
