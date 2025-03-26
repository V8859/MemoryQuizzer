import React, { useState } from "react";

type Props = {};

const CardTag = ({
  initialValue,
  identifier,
}: {
  initialValue: string;
  identifier: string;
}) => {
  const [currentValue, setCurrentValue] = useState(initialValue);
  const handleChange = (e: any) => {
    setCurrentValue(e.target.value);
  };
  return (
    <div>
      <textarea
        placeholder="Tag"
        name={`${identifier}_tag`}
        maxLength={20}
        value={currentValue}
        onChange={handleChange}
        className="NoteObject placeholder:text-center text-center items-center justify-center"
      />
    </div>
  );
};

export default CardTag;
