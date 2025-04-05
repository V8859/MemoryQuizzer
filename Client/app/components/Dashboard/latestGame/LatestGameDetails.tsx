import React from "react";
import Head from "./Head";
import Row from "./Row";
import { guestMode } from "@/app/context/DataContext";

type Props = {
  data: [item];
};

type item = {
  date: string;
  deckName: string;
  score: number;
  noOfCards: number;
};

const LatestGameDetails = (props: Props) => {
  const { data } = props;
  // let badate = "";
  // console.log(data);
  // if (data != null) {
  //   let adate = data.details.date.split("T")[0];
  //   badate = new Date(adate).toLocaleDateString();
  // }

  return (
    <div className="flex flex-col my-2 items-center">
      <h1 className="h-full text-[20px] font-sans text-center">Latest Game</h1>
      <div className="flex items-center w-[80%] rounded-2xl bg-[var(--header)] backdrop-blur-0 SmallDivShadow">
        <div className="w-full">
          <div className="flex flex-col px-4 w-full">
            <div className="flex text-white">
              <Head title={"Deck"}></Head>
              <Head title={"Score"}></Head>
              <Head title={"Date"}></Head>
            </div>
            <div className="flex flex-col text-white/90 text-md">
              {data.details.error
                ? ""
                : data.details.map((item: item, key: number | string) => {
                    const adate = new Date(
                      item.date.split("T")[0]
                    ).toLocaleDateString();
                    return (
                      <Row
                        key={key}
                        name={guestMode ? item.nameOfDeck : item.deckName}
                        score={
                          guestMode
                            ? `${item.gameScore}/${item.noOfCards}`
                            : `${item.score}/${item.noOfCards}`
                        }
                        date={adate}
                      ></Row>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestGameDetails;
