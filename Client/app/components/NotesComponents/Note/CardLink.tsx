import React, { useState } from "react";

type Props = {};

const CardLink = ({
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
        placeholder="Link"
        name={`${identifier}_link`}
        value={currentValue}
        onChange={handleChange}
        className="NoteObject placeholder:text-center text-center"
      />
    </div>
  );
};

export default CardLink;
