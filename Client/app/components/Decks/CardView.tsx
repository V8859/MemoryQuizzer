"use client";

import { fetchNotes } from "@/app/scripts/notes";
import React, { useEffect, useState } from "react";
import FlashCarousel from "./FlashCarousel";
import { Filter } from "lucide-react";
import FlashList from "./FlashList";

const CardView = ({ notebookId }: { notebookId: string | undefined }) => {
  const [data, setData] = useState([]);
  const [view, setView] = useState(false);

  useEffect(() => {
    if (notebookId) {
      fetchNotes(setData, notebookId);
      console.log(data);
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
            <FlashList children={data}></FlashList>
          ) : (
            <FlashCarousel children={data}></FlashCarousel>
          )
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default CardView;
