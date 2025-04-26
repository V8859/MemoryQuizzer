import { useData } from "@/app/context/DataContext";
import { fetchNotes } from "@/app/scripts/notes";
import { getPlayDeck } from "@/app/scripts/play";
import { NotebookObject, NoteObject } from "@/app/Types/NoteTypes";
import React, { Dispatch, SetStateAction, useState } from "react";

type Props = {
  data: NotebookObject;
  setPlayMode: Dispatch<SetStateAction<boolean>>;
  setCards: Dispatch<SetStateAction<NoteObject[]>>;
  setDeckName: Dispatch<SetStateAction<string>>;
};
type Entries = {
  id: string;
  createdAt: string | Date;
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
        const data = await fetchNotes(props.data.id);
        if (data) {
          const entries = Object.values(data);
          props.setDeckName(props.data.name);
          if (entries.length > 0) {
            const sortedEntries: Entries[] = entries.sort(
              (a: Entries, b: Entries) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            );

            if (sortedEntries.length > 0) {
              const id = sortedEntries[0].id;
              const playDeck = await getPlayDeck(id);
              if (playDeck.length > 3) {
                props.setPlayMode(true);
              } else {
                toggleAlert(
                  "Only found 3 links, please modify your cards.",
                  true
                );
              }

              if (playDeck) {
                // console.log("PlayDeck", playDeck);
                props.setCards(playDeck);
              }
            }
          }
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
