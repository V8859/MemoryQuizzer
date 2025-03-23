import React from "react";
import Cell from "./Cell";

type Props = {
  name: string;
  score: string;
  date: string;
};

const Row = (props: Props) => {
  return (
    <div className="flex py-1">
      <Cell data={props.name} />
      <Cell data={props.score} />
      <Cell data={props.date} />
    </div>
  );
};

export default Row;
