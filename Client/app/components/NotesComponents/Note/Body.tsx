import React, { useState } from "react";
const Body = ({
  identifier,
  currentLines,
  setCurrentLines,
  setCurrentValue,
  currentValue,
}: {
  identifier: string;
  currentLines: number;
  setCurrentLines: Function;
  setCurrentValue: Function;
  currentValue: string;
}) => {
  const [stopper, setStopper] = useState(true);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 600) {
      setCurrentValue(e.target.value);
    }
  };

  const handleKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && stopper) {
      setCurrentLines(currentLines + 1);
    }
  };

  return (
    <div className="w-full h-full">
      <textarea
        placeholder="Answer"
        rows={7}
        cols={10}
        name={`${identifier}_answer`}
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeydown}
        className="NoteBody"
        maxLength={600}
      ></textarea>
    </div>
  );
};
export default Body;
