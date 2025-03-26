import React from "react";

const CharacterCounts = (currentValue: any) => {
  const curr = currentValue.currentValue;
  return <div className="flex">{curr ? `${curr.length} / 600` : 0}</div>;
};

export default CharacterCounts;
