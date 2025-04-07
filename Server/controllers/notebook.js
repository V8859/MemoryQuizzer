const { PrismaClient } = require("@prisma/client");
const { NotFoundError } = require("../utils/errors");
const { response } = require("express");
const prisma = new PrismaClient();

const addNotebook = async (req, res) => {
  const { id, name } = req.body;
  let notebook = await prisma.notebook.create({
    data: {
      User: {
        connect: {
          id: id,
        },
      },
      name: name,
    },
  });
  if (notebook) {
    res.json({ ok: true, notebooks: notebook });
  }
};

const getNotebooks = async (req, res) => {
  const { id } = req.query;
  let user = await prisma.user.findUnique({
    where: { id: id },
    include: { notebook: true },
  });
  if (user) {
    const notebooks = user.notebook;
    res.json(notebooks);
  } else {
    res.json({ respnse: "No user found" });
  }
};

const getNotebooksAndLength = async (req, res) => {
  const { id } = req.query;
  let notebooks = await prisma.notebook.findMany({
    where: { userId: id },
    include: {
      notes: true,
    },
  });
  const filteredNotebooks = notebooks.filter(
    (notebook) => notebook.notes.length > 3
  );
  if (notebooks && filteredNotebooks) {
    const hidden = !(notebooks.length === filteredNotebooks.length);
    res.json({ books: filteredNotebooks, hidden: hidden });
  } else {
    res.json({ response: "No books found" });
  }
};

const deleteNotebook = async (req, res) => {
  const { id } = req.body;
  try {
    let note = await prisma.note.deleteMany({
      where: {
        notebookId: id,
      },
    });

    let notebook = await prisma.notebook.delete({
      where: {
        id: id,
      },
    });
    if (notebook) {
      res.json("success");
    }
  } catch (err) {
    console.log(err);
    res.json("error");
  }
};

const renameNotebook = async (req, res) => {
  const { id, name } = req.body;
  let notebook = await prisma.notebook.update({
    where: {
      id: id,
    },
    data: {
      name: name,
    },
  });
  if (notebook) {
    res.json("success");
  } else {
    res.json("error");
  }
};

module.exports = {
  addNotebook,
  getNotebooks,
  getNotebooksAndLength,
  deleteNotebook,
  renameNotebook,
};
