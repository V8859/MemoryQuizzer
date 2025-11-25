"use client";
import React, { useState } from "react";
import DropDown from "../Dropdown";
import CardView from "../CardView";
import PageHeader from "../../General/PageHeader";

type selectedOption =
  | {
    createdAt: string;
    id: string;
    label: string;
    name: string;
    score: number;
  }
  | undefined;

const Composer = () => {
  const [selectedOption, setSelectedOption] = useState<selectedOption>();
  // console.log("THIS IS SELECTED OPTION", selectedOption);
  return (
    <>
      <div className="Composer">
        <div className="NoteArea">
          <div className="sticky top-0 z-20">
            <PageHeader
              title="Dashboard"
              href="/"
              message={selectedOption?.name ?? "SELECT DECK"}
            >
              <DropDown
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
              ></DropDown>
              {undefined}

            </PageHeader>
          </div>

          <div className="mt-5"></div>

          <div>
            {selectedOption ? (
              <CardView notebookId={selectedOption.id}></CardView>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Composer;
