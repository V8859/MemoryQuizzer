const { PrismaClient } = require("@prisma/client");
const { response } = require("express");
const prisma = new PrismaClient();

const getPlayDeck = async (req, res) => {
  const { id } = req.query;
  let playDeck = [];
  let firstNote = await prisma.note.findUnique({
    where: { id: id },
  });
  let curr = firstNote;
  const finalLink = firstNote.tag;
  if (firstNote) {
    playDeck.push(firstNote);
    let n = [];
    while (true) {
      try {
        n = await prisma.note.findMany({
          where: { link: curr.tag },
          orderBy: { score: "asc" },
        });
      } catch (err) {
        console.log(err);
        res.json({ response: "No user found" });
        break;
      }

      if (n.length > 0) {
        const temp = filterAndReturnCards(n);

        if (!playDeck.some((note) => note.id == temp.id)) {
          playDeck.push(temp);
          curr = temp;
        } else {
          break;
        }
      } else {
        break;
      }
    }
  }
  if (playDeck.length > 0) {
    res.json(playDeck);
  } else {
    res.json({ response: "No user found" });
  }
};

const updateScores = async (req, res) => {
  const { notes, notebooks, gameResult } = req.body;

  let notesArray = notes.noteData;
  let notebookArray = notebooks.notebookData;
  try {
    for (key in notesArray) {
      await prisma.note.update({
        where: {
          id: key,
        },
        data: {
          score: {
            increment: notesArray[key],
          },
        },
      });
    }
    // console.log(notebookArray);
    for (key in notebookArray) {
      // console.log(key + " :" + notebookArray[key]);
      let update = await prisma.notebook.update({
        where: { id: key },
        data: {
          score: { increment: notebookArray[key] },
        },
      });
      // console.log(update);
    }
    await prisma.gameScore.create({
      data: {
        score: gameResult.gameScore,
        userId: gameResult.id,
        deckName: gameResult.nameOfDeck,
        noOfCards: gameResult.noOfCards,
      },
    });
  } catch (err) {
    console.log(err);
    res.json({ errorCode: "500", error: err });
  }
};

const getLatestGame = async (req, res) => {
  const { id } = req.query;
  try {
    let rScore = await prisma.gameScore.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        date: "desc",
      },
      take: 10,
    });
    if (rScore) {
      // console.log(rScore);
      res.json(rScore);
    } else {
      res.status(500).json({ error: "No GameScore found" });
    }
  } catch (err) {
    res.status(500).json({ error: "No GameScore found" });
  }
};

function filterAndReturnCards(array) {
  const minScore = array[0]?.score;
  const filteredArray = array.filter((record) => record.score === minScore);
  const randomCard = Math.floor(Math.random() * filteredArray.length);
  // console.log("THIS IS THE FILTERED CARD: ", filteredArray[randomCard]);
  return filteredArray[randomCard];
}

module.exports = { getPlayDeck, updateScores, getLatestGame };
