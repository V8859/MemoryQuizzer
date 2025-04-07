"use client";
import React from "react";
import { Card } from "./Card";
import { NoteObject } from "@/app/Types/NoteTypes";

interface Props {
  data: NoteObject[];
}

const FlashList = (props: Props) => {
  return (
    <div>
      {props.data.map((element) => (
        <div key={element.id} className="mb-10">
          <Card Front={element.question} Back={element.answer} />
        </div>
      ))}
    </div>
  );
};

export default FlashList;
