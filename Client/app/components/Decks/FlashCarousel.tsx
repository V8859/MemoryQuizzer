"use client";
import { useState } from "react";
import { FlashCard } from "./Flashcard";
import { ChevronLeft, ChevronRight } from "lucide-react";
const FlashCarousel = ({ children = null }) => {
  const [curr, setCurr] = useState(0);
  const [animationClass, setAnimationClass] = useState("");
  const [isflipped, setFlipped] = useState(false);

  const handleNext = () => {
    setFlipped(false);
    setAnimationClass(
      "transform transition-transform duration-1000 ease-in-out opacity-0 translate-x-[75%]"
    );
    setTimeout(() => {
      setCurr((curr + 1) % children.length);
      setAnimationClass(
        "transform transition-transform duration-1000 ease-in-out opacity-100 translate-x-0"
      );
    }, 250);
  };

  const handlePrev = () => {
    setFlipped(false);
    setAnimationClass(
      "transform transition-transform duration-1000 ease-in-out opacity-0 -translate-x-[75%]"
    );
    setTimeout(() => {
      setCurr((curr - 1 + children.length) % children.length);
      setAnimationClass(
        "transform transition-transform duration-1000 ease-in-out opacity-100 translate-x-0"
      );
    }, 250);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className={`p-2  ${animationClass}`}>
          {
            <FlashCard
              Front={children[curr].question}
              Back={children[curr].answer}
              isFlipped={isflipped}
              setFlipped={setFlipped}
            />
          }
        </div>

        <div className="flex w-full mt-2 justify-center items-center">
          <div className="flex gap-3 items-center">
            <button
              onClick={handlePrev}
              className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white"
            >
              <ChevronLeft />
            </button>
            <div>{`${curr + 1}/${children.length}`}</div>
            <button
              onClick={handleNext}
              className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FlashCarousel;
