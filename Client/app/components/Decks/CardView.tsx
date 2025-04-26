"use client";

import { fetchNotes } from "@/app/scripts/notes";
import React, { useEffect, useState } from "react";
import FlashCarousel from "./FlashCarousel";
import { Filter } from "lucide-react";
import FlashList from "./FlashList";
import { NoteObject } from "@/app/Types/NoteTypes";

const CardView = ({ notebookId }: { notebookId: string | undefined }) => {
  const [data, setData] = useState<NoteObject[]>([]);
  const [view, setView] = useState(false);

  useEffect(() => {
    if (notebookId) {
      fetchNotes(notebookId, setData);
    }
  }, [notebookId]);
  return (
    <>
      <div>
        <div className="flex p-5 justify-center">
          <button
            className="CardViewButton"
            onClick={() => {
              setView(!view);
            }}
          >
            <Filter className="w-5 h-5"></Filter>
            {view ? "List" : "Single"}
          </button>
        </div>
        {data.length > 0 ? (
          view ? (
            <FlashList data={data}></FlashList>
          ) : (
            <FlashCarousel data={data}></FlashCarousel>
          )
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default CardView;
