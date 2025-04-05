"use client";
import React from "react";
import { Card } from "./Card";

type element = {
  id: string;
  question: string;
  answer: string;
};
interface Props {
  data: [element] | never[];
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
