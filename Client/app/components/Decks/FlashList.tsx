"use client";
import React from "react";
import { Card } from "./Card";

const FlashList = ({ children }) => {
  return (
    <div>
      {children.map((element) => (
        <div key={element.id} className="mb-10">
          <Card Front={element.question} Back={element.answer} />
        </div>
      ))}
    </div>
  );
};

export default FlashList;
