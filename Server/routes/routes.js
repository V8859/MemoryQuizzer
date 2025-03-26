const { validateRequest } = require("../middlewares/validate-request");

// Controller
const {
  addNotebook,
  getNotebooks,
  getNotebooksAndLength,
  deleteNotebook,
  renameNotebook,
} = require("../controllers/notebook");
const { getNotes, addNote, saveNotes } = require("../controllers/note");
const { addOrRetrieveUser } = require("../controllers/utility");
const {
  getPlayDeck,
  updateScores,
  getLatestGame,
} = require("../controllers/play");
// Middlewares
const router = require("express").Router();

// Validation
const {
  addNotebookSchema,
  addNoteSchema,
  addOrRetrieveUserSchema,
} = require("../utils/validation-schema");

//Routes
/// POST
router.post("/notebooks/add", validateRequest(addNotebookSchema), addNotebook);
router.post("/notes/add", validateRequest(addNoteSchema), addNote);
router.post("/notes/save", saveNotes);
router.post("/notebook/notes", getNotes);
router.post(
  "/user/id",
  validateRequest(addOrRetrieveUserSchema),
  addOrRetrieveUser
);
router.post("/saveGame", updateScores);
router.post("/notebook/delete", deleteNotebook);
router.post("/notebook/rename", renameNotebook);

/// GET
router.get("/notebooks", getNotebooks);
router.get("/notebooksWithLength", getNotebooksAndLength);
router.get("/playDeck", getPlayDeck);
router.get("/latestGame", getLatestGame);
module.exports = router;
