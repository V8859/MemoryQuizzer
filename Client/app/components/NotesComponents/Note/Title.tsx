"use client";
import React, { useState } from "react";

const Title = ({
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
        placeholder="Question"
        name={`${identifier}_question`}
        value={currentValue}
        onChange={handleChange}
        className="NoteObject"
        maxLength={250}
      />
    </div>
  );
};

export default Title;
