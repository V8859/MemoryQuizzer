import React from "react";

type Props = {
  data: string;
};

const Cell = (props: Props) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="text-center flex w-full justify-center">{props.data}</div>
    </div>
  );
};

export default Cell;
