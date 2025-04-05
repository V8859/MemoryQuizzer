"use client";
import React, { useEffect, useState } from "react";
import LatestGameDetails from "./latestGame/LatestGameDetails";
import { getGameScores } from "@/app/scripts/play";
import PageHeader from "../PageHeader";

type Props = {
  userName: string | undefined | null;
};

type gameData = any;

type updateData = {
  details: gameData;
};

const Composer = (props: Props) => {
  const [data, setData] = useState<updateData | null>(null);
  const [check, setCheck] = useState(false);
  useEffect(() => {
    const getScores = async () => {
      const id = localStorage.getItem("userId");
      try {
        const gameData = await getGameScores(id);
        const updateData: updateData = { details: gameData };
        if (updateData.details.error) {
          setData(null);
        } else {
          setData(updateData);
          console.log("UPDATE DATA", updateData);
        }
        setCheck(true);
      } catch (err) {
        console.error("ERROR FETCHING GAME SCORES:", err);
        setCheck(false);
      }
    };
    getScores();
  }, []);
  return (
    <div className="Composer">
      <div className="NoteArea">
        <PageHeader
          title="Dashboard"
          href="/"
          message="Welcome"
          userName={props.userName}
        ></PageHeader>
        {data ? <LatestGameDetails data={data}></LatestGameDetails> : ""}
      </div>
    </div>
  );
};

export default Composer;
