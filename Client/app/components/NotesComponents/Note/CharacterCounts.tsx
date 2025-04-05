import React from "react";

type currentValue = {
  currentValue: string;
};

const CharacterCounts = (currentValue: currentValue) => {
  const curr = currentValue.currentValue;
  return <div className="flex">{curr ? `${curr.length} / 600` : 0}</div>;
};

export default CharacterCounts;
