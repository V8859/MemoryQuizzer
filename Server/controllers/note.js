const { PrismaClient } = require("@prisma/client");
const { NotFoundError } = require("../utils/errors");
const prisma = new PrismaClient();

getNotes = async (req, res) => {
  const { id } = req.body;
  const notes = await prisma.note.findMany({
    where: { notebookId: id },
    orderBy: { createdAt: "asc" },
  });
  res.json({ notes: notes });
};

addNote = async (req, res) => {
  const { id, notes, userId } = req.query;

  const note = await createNewNote(notes, id, userId);
  if (note) {
    res.json({ cid: note.id });
  } else {
    res.json({ cid: "failed" });
  }
};

saveNotes = async (req, res) => {
  const { id, notes, userId } = req.body;
  const rezponze = {};
  let check = false;
  for (key in notes) {
    if (!(notes[key].id === "")) {
      const mes = await updateProcess(notes[key], id);
      rezponze[key] = mes;
      check = true;
    } else {
      const note = await createNewNote(notes[key], id, userId);
      check = true;
    }
  }
  if (check) {
    res.json(rezponze);
  } else {
    res.json({ answer: "FAILED" });
  }
};

const validateUniqueTags = async (notes) => {
  console.log(notes);
  const tagSet = new Set();

  for (let key in notes) {
    const tag = notes[key].tag;
    console.log("TAG", tag);
    if (tagSet.has(tag)) {
      return { error: true, message: `Duplicate tag found: ${tag}` };
    }
    tagSet.add(tag);

    // Check if the tag already exists in the database, excluding the current note
    const existingNoteWithTag = await prisma.note.findFirst({
      where: {
        tag: tag,
        NOT: {
          id: notes[key].id || undefined,
        },
      },
    });

    if (existingNoteWithTag) {
      return {
        error: true,
        message: `Tag ${tag} already exists in another note.`,
      };
    }
  }

  return { error: false };
};

const updateNote = async (data) => {
  console.log(data);
  let note = await prisma.note.update({
    where: { id: data.id },
    data: {
      question: data.question,
      answer: data.answer,
      link: data.link,
      tag: data.tag,
    },
  });
  console.log(note);
  return note;
};

const createNotes = async (data, id, userId) => {
  console.log(data, id, userId);
  try {
    let note = await prisma.note.create({
      data: {
        question: data.question,
        answer: data.answer,
        link: data.link,
        tag: data.tag,
        userId: userId,
        notebook: {
          connect: {
            id: id,
          },
        },
      },
    });
    if (note) {
      return note;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

const updateProcess = async (data, notebookId) => {
  // console.log("Data received:", data);

  // Validate unique tags
  const validationResponse = await validateUniqueTags({ [data.id]: data });
  if (validationResponse.error) {
    return { error: "DuplicateTagError", message: validationResponse.message };
  }

  try {
    // Update the note
    const updatedNote = await updateNote(data);
    console.log("Note Updated:", updateNote);
    return { success: true, note: updatedNote };
  } catch (err) {
    console.log("Error:", err);
    return { error: "InternalServerError", message: "An error occurred." };
  }
};

const findNewNote = async (data, id, userId) => {
  let note = await prisma.note.findFirst({
    where: { id: data.id },
  });
  let noted = await prisma.note.findUnique({
    where: {
      tag_userId: {
        tag: data.tag,
        userId: userId,
      },
    },
  });
  console.log("ID find: ", note);
  console.log("Tag find: ", noted);
  if (note || noted) {
    console.log(true);
    return true;
  } else {
    console.log(false);
    return false;
  }
};
const createNewNote = async (data, id, userId) => {
  console.log("Invoked second");
  let note = await findNewNote(data, id, userId);
  if (!note) {
    console.log("Invoked third");
    const note = await createNotes(data, id, userId);
    return note;
  } else {
    return false;
  }
};

const findNote = async (data) => {
  let note = await prisma.note.findFirst({
    where: { id: data.id },
  });
  console.log(note);
  // let noted = await prisma.note.findFirst({
  //   where: { tag: data.Tag },
  // });
  if (note) {
    return true;
  } else {
    return false;
  }
};

module.exports = { getNotes, addNote, saveNotes };
