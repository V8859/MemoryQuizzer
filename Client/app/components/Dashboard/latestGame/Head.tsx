import React from "react";

type Props = { title: string };

const Head = (props: Props) => {
  return (
    <div className="w-full font-sans font-semibold text-center text-[18px]">
      {props.title}
    </div>
  );
};

export default Head;
