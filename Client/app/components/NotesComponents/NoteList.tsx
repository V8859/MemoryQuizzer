"use client";
import React, { useEffect, useState } from "react";
import { fetchNotes, saveNotes } from "@/app/scripts/notes";
import Form from "next/form";
import { CirclePlus, Save } from "lucide-react";
import { stringify } from "querystring";
import PageHeader from "../PageHeader";

export const NoteList = ({
  noteId,
  data,
  setData,
  notebookName,
}: {
  noteId: string | undefined;
  data: any;
  setData: any;
  notebookName: string;
}) => {
  const [update, setUpdate] = useState(false);
  useEffect(() => {
    if (noteId) {
      fetchNotes(setData, noteId);
    }
  }, [noteId, update]);

  async function handleSubmit(e: any) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const notes: any = {};
    for (let [key, value] of formData.entries()) {
      const [noteId, field] = key.split("_");
      if (!notes[noteId]) {
        notes[noteId] = {};
      }
      notes[noteId][field] = value;
    }
    for (let key in data) {
      notes[key].id = data[key].id;
    }
    const payload = {
      notes: notes,
      id: noteId,
      userId: localStorage.getItem("userId"),
    };
    console.log("Saving:", payload);
    try {
      const response = await saveNotes(payload);
      if (response) {
        const sanData = await response.json();
        setUpdate(!update);
      }
      // console.log("save response: ", sanData);
    } catch (err) {
      console.log(err);
    }
  }
  async function addNote(e: any) {
    e.preventDefault();
    const skeleton = {
      question: "TEST",
      answer: "",
      link: "",
      tag: "",
      id: "",
    };
    const payload = {
      notes: skeleton,
      id: noteId,
      userId: localStorage.getItem("userId"),
    };
    setData((prevData: any) => {
      const updatedData = [...prevData, skeleton];
      console.log(updatedData);
      return updatedData;
    });
    // try {
    //   const response = await fetch("http://localhost:8080/api/notes/add", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(payload),
    //   });
    //   const cid = await response.json();

    //   if (!(cid.cid === "failed")) {
    //     console.log(cid);
    //     skeleton.id = cid.cid;

    //     console.log(skeleton);
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
  }

  return (
    <>
      <div className="NoteArea">
        <div className="sticky top-0">
          <PageHeader
            title="Dashboard"
            href="/"
            message={notebookName.length > 0 ? notebookName : "SELECT BOOK"}
          ></PageHeader>
        </div>
        <form
          className="flex flex-col items-center w-[100%]"
          id="SavingForm"
          method="post"
          onSubmit={handleSubmit}
        >
          <ul className="w-full px-0 md:px-11">
            {Object.keys(data).map((key) => (
              <li key={key}>
                <Note
                  Content={data[key]}
                  identifier={key}
                  noteId={data.id}
                ></Note>
              </li>
            ))}
          </ul>
        </form>
        <form id="AddingForm" onSubmit={addNote} method="post"></form>
        <div className="flex flex-col items-center">
          <div className="flex gap-4">
            <button form="AddingForm" className="NoteButtons" type="submit">
              <CirclePlus></CirclePlus>
            </button>
            <button className="NoteButtons" form="SavingForm" type="submit">
              <Save></Save>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoteList;

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

const CharacterCounts = (currentValue: any) => {
  const curr = currentValue.currentValue;
  return (
    <div className="flex">
      {curr.length}/{600}
    </div>
  );
};

const Body = ({
  identifier,
  currentLines,
  setCurrentLines,
  setCurrentValue,
  currentValue,
}: {
  identifier: string;
  currentLines: any;
  setCurrentLines: any;
  setCurrentValue: any;
  currentValue: any;
}) => {
  const [stopper, setStopper] = useState(true);
  const handleChange = (e: any) => {
    if (e.target.value.length <= 600) {
      setCurrentValue(e.target.value);
    }
  };

  const handleKeydown = (e) => {
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
