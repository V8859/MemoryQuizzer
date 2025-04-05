import { useData } from "@/app/context/DataContext";
import { getPlayDeck } from "@/app/scripts/play";
import React, { useState } from "react";
import Alert from "../../Alert";

type Props = {
  data: any;
  setPlayMode: any;
  setCards: any;
  setDeckName: Function;
};

const PlayCard = (props: Props) => {
  const [details, setDetails] = useState(false);
  const { toggleAlert } = useData();
  const handeDetails = (answer: boolean) => {
    setDetails(answer);
  };
  return (
    <div
      className="PlayCard flex-col"
      onMouseEnter={() => handeDetails(true)}
      onMouseLeave={() => handeDetails(false)}
      onClick={async () => {
        // console.log(props.data);

        const entries = Object.values(props.data.notes);
        props.setDeckName(props.data.name);
        const sortedEntries: any = entries.sort(
          (a: any, b: any) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        const id = sortedEntries[0].id;
        const playDeck = await getPlayDeck(id);
        if (playDeck.length > 3) {
          props.setPlayMode(true);
        } else {
          toggleAlert("Only found 3 links, please modify your cards.", true);
        }

        if (playDeck) {
          console.log("PlayDeck", playDeck);
          props.setCards(playDeck);
        }
      }}
    >
      {props.data.name}
      <div
        className={`absolute flex bottom-[10px] w-fit justify-evenly gap-14 items-end ${
          details ? "PlayCardAnimation" : "PlayCardAnimationOne"
        }`}
      >
        {details ? (
          <>
            <div className="flex flex-col">
              Score <span>{props.data.score}</span>
            </div>
            <div className="flex flex-col">
              Created
              <span>
                {props.data.createdAt
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join("-")}
              </span>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default PlayCard;
