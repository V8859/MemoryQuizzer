"use client";
import React, { useState } from "react";
import Title from "./Title";
import Body from "./Body";
import CardLink from "./CardLink";
import CharacterCounts from "./CharacterCounts";
import CardTag from "./CardTag";

type Props = {};

const Note = ({
  Content,
  identifier,
  noteId,
}: {
  noteId: string;
  Content: any;
  identifier: string;
}) => {
  const { question, answer, link, tag } = Content;

  // The states below are only meant for <Body/>
  const [currentLines, setCurrentLines] = useState(0);
  const [currentValue, setCurrentValue] = useState(answer);
  // // // Please don't use for anything other than <Body/> or CharacterCounts

  // console.log(Content.Title);
  return (
    <>
      <div className="NoteBox">
        <Title initialValue={question} identifier={identifier}></Title>
        <Body
          currentLines={currentLines}
          setCurrentLines={setCurrentLines}
          currentValue={currentValue}
          setCurrentValue={setCurrentValue}
          identifier={identifier}
        ></Body>
        <div className="flex flex-col items-center justify-between md:flex-row">
          <CardLink initialValue={link} identifier={identifier}></CardLink>
          <CharacterCounts currentValue={currentValue}></CharacterCounts>
          <CardTag initialValue={tag} identifier={identifier}></CardTag>
        </div>
      </div>
    </>
  );
};

export default Note;
