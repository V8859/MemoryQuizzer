"use client";
import React, { use, useEffect, useState } from "react";
import Select from "react-select/base";
import DropDown from "../Dropdown";
import FlashCarousel from "../FlashCarousel";
import CardView from "../CardView";
import PageHeader from "../../PageHeader";

const Composer = () => {
  const [selectedOption, setSelectedOption] = useState();
  console.log(selectedOption);
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
