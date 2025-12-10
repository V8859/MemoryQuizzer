import React, { useState } from "react";

const CardTag = ({
  initialValue,
  identifier,
}: {
  initialValue: string;
  identifier: string;
}) => {
  const [currentValue, setCurrentValue] = useState(initialValue);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentValue(e.target.value);
  };
  return (
    <div className="flex flex-col">
      <span className="text-blue-500">Tag</span>
      <textarea
        placeholder="Tag"
        name={`${identifier}_tag`}
        maxLength={20}
        value={currentValue}
        onChange={handleChange}
        className="NoteObject"
      />
    </div>
  );
};

export default CardTag;
