"use client";
import { useEffect, useState } from "react";
import { Card } from "../Card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { saveGameScores } from "@/app/scripts/play";

const FlashCarousel = ({
  children,
  deckName,
}: {
  children: any;
  deckName: string | null;
}) => {
  const [curr, setCurr] = useState(0);
  const [animationClass, setAnimationClass] = useState("");
  const [isflipped, setFlipped] = useState(false);
  const [options, setOptions] = useState([]);
  const [correct, setCorrect] = useState("");
  const [correctKey, setCorrectKey] = useState();
  const [disabled, setDisabled] = useState(false);
  const [game, setGame] = useState(true);
  const [gameScore, setGameScore] = useState(Number);
  const [message, setMessage] = useState("");
  const [noteData, setNoteData] = useState();
  const [notebookData, setNotebookData] = useState();
  useEffect(() => {
    if (curr == children.length) {
      setDisabled(true);
      setFlipped(true);
    }
    const setter = async () => {
      let op = getOptions(curr, children);
      setOptions(op);
    };
    setter();
  }, [curr]);

  const handleIncrements = (choice: any) => {
    setNoteData((previousNoteData: any) => {
      const newNoteData = { ...previousNoteData };
      if (choice.id in newNoteData) {
        newNoteData[choice.id] += 1;
      } else {
        newNoteData[choice.id] = 1;
      }
      return newNoteData;
    });
    setNotebookData((prevData: any) => {
      const newData = { ...prevData };
      if (choice.notebookId in newData) {
        newData[choice.notebookId] += 1;
      } else {
        newData[choice.notebookId] = 1;
      }
      return newData;
    });
  };
  const handeDecrements = (choice: any) => {
    setNoteData((previousNoteData: any) => {
      const newNoteData = { ...previousNoteData };
      if (choice.id in newNoteData) {
        newNoteData[choice.id] -= 1;
      } else {
        newNoteData[choice.id] = -1;
      }
      return newNoteData;
    });
    setNotebookData((oldData: any) => {
      const newData = { ...oldData };
      if (choice.notebookId in newData) {
        newData[choice.notebookId] -= 1;
      } else {
        newData[choice.notebookId] = -1;
      }
      return newData;
    });
  };

  const handeChoice = (choice: any, key: any) => {
    if (curr < children.length) {
      if (children[curr] == choice) {
        console.log(noteData);
        setCorrect("bg-green-400 rounded-xl");
        setGameScore(gameScore + 1);
        handleIncrements(children[curr]);
      } else {
        setCorrect("bg-red-400 rounded-xl");
        handeDecrements(children[curr]);
      }

      setCorrectKey(key);
      setFlipped(true);
      setDisabled(true);
    }
  };

  const handleNext = async () => {
    setFlipped(false);
    setDisabled(false);
    setCorrect("");
    if (curr < children.length - 1) {
      setAnimationClass(
        "transform transition-transform duration-1000 ease-in-out opacity-0 translate-x-[75%]"
      );
    } else {
      setGame(false);
      const payload = {
        notes: { noteData },
        notebooks: { notebookData },
        gameResult: {
          gameScore,
          id: children[0].userId,
          nameOfDeck: deckName,
          noOfCards: curr + 1,
        },
      };
      console.log(payload);
      try {
        const res = await saveGameScores(payload);
        if (res) {
          const data = await res.json();
        }
      } catch (err) {
        console.log(err);
      }

      const messag = endMessage(gameScore, children.length);
      setMessage(messag);
    }

    setTimeout(() => {
      if (curr < children.length - 1) {
        setCurr(curr + 1);
      }
      setAnimationClass(
        "transform transition-transform duration-1000 ease-in-out opacity-100 translate-x-0"
      );
    }, 200);
  };

  const handlePrev = () => {
    setFlipped(false);
    if (curr > 0) {
      setAnimationClass(
        "transform transition-transform duration-1000 ease-in-out opacity-0 -translate-x-[75%]"
      );
    }

    setTimeout(() => {
      if (curr > 0) {
        console.log(curr);
        setCurr(curr - 1 + children.length);
      }
      setAnimationClass(
        "transform transition-transform duration-1000 ease-in-out opacity-100 translate-x-0"
      );
    }, 250);
  };

  return (
    <>
      {game ? (
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-row justify-center">
            <div className={`p-2 flex  ${animationClass}`}>
              {
                <Card
                  Front={children[curr].question}
                  Back={children[curr].answer}
                  isFlipped={isflipped}
                />
              }
            </div>
            <div className="flex items-center">
              {isflipped ? (
                <div className="hover:bg-blue-300 h-[50%] items-center flex rounded cursor-pointer">
                  <ChevronRight
                    className="h-full"
                    onClick={() => {
                      handleNext();
                    }}
                  ></ChevronRight>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          {/* <div className="flex w-full mt-2 justify-center items-center">
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
        </div> */}
          <div>
            <div className="flex flex-col gap-2 items-center w-full">
              {options.length > 0
                ? options.map((choice, key) => (
                    <div
                      className="w-[110%] mx-10 flex flex-col border-2 rounded-xl hover:scale-y-105"
                      key={key}
                    >
                      <button
                        disabled={disabled}
                        className={`${correctKey == key ? correct : ""} ${
                          disabled ? "" : "hover:bg-blue-300 rounded-xl"
                        }`}
                        onClick={() => {
                          handeChoice(choice, key);
                        }}
                      >
                        {choice.answer}
                      </button>
                    </div>
                  ))
                : "loading..."}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <div className="flex flex-col font-[Consolas] gap-4 text-2xl items-center justify-center">
            <h1>Results</h1>
            <h1 className="flex flex-col items-center gap-4">
              <h1>{message}</h1>
              <h1>You got {gameScore + "/" + children.length} correct</h1>
            </h1>
          </div>
        </div>
      )}
    </>
  );
};

export default FlashCarousel;

const AnswerView = () => {};

function getOptions(currIndex: number, data: []) {
  let newData = data.slice();
  newData.splice(currIndex, 1);
  let options = [];
  let used = [];
  options.push(data[currIndex]);
  let check = true;
  while (check) {
    let x = Math.random() * newData.length;
    x = Math.floor(x);
    if (options.length == 4) {
      shuffle(options);
      return options;
    }
    if (options.length < 5 && !used.includes(x)) {
      used.push(x);
      options.push(newData[x]);
    }
  }
  return [];
}

// Fisher-Yates Algorithm // Courtesy of Bro Code
function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const random = Math.floor(Math.random() * (i + 1));
    [array[i], array[random]] = [array[random], array[i]];
  }
}

function endMessage(gameScore: number, length: number) {
  const failedMessage = "You lose!";
  const okayMessage = "Better luck next time";
  const betterMessage = "Good job, a bit more practice and you'll get there";
  const amazingMessage = "Amazing! You got them all correct!";

  let value = gameScore / length;

  if (value === 1) {
    return amazingMessage;
  } else if (value >= 0.75) {
    return betterMessage;
  } else if (value >= 0.5) {
    return okayMessage;
  } else {
    return failedMessage;
  }
}
