const express = require("express");
const app = express();
const PORT1 = 8080;

const cors = require("cors");

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.text());

//startup
require("./startup/routes")(app);

// This should be a post not get (GET can be seen in the url)
app.get("/api/user/id", async (req, res) => {
  try {
    const { name, email } = req.query; // Extract name and email from query parameters
    // console.log(req.query); // Log the query parameters

    let user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: name,
          email: email,
        },
      });
    }

    res.json({ id: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// saveNotes
// app.post("/api/notes/save", async (req, res) => {
//   const { id, notes, userId } = req.body;
//   // console.log("Called database ", notes);
//   const rezponze = {};
//   try {
//     for (key in notes) {
//       if (!(notes[key].id === "")) {
//         const mes = await updateProcess(notes[key], id);
//         rezponze[key] = mes;
//       } else {
//         console.log("Invoked");
//         const note = await createNewNote(notes[key], id, userId);
//         console.log(note);
//       }
//     }
//     res.json(rezponze);
//   } catch (err) {
//     res.json({ message: err });
//   }
// });

// addNote
// app.post("/api/notes/add", async (req, res) => {
//   const { id, notes, userId } = req.body;
//   // const sendId = await updateNewNote(notes, id);
//   const note = await createNewNote(notes, id, userId);
//   if (note) {
//     res.json({ cid: note.id });
//   } else {
//     res.json({ cid: "failed" });
//     console.log("failed");
//   }
// });

// getNotes
// app.post("/api/notebook/notes", async (req, res) => {
//   console.log(req.body);
//   const { id } = req.body;
//   const notes = await prisma.note.findMany({
//     where: { notebookId: id },
//   });
//   res.json({ notes: notes });
// });

app.listen(PORT1, () => {
  console.log(`Server started on port ${PORT1}`);
});
