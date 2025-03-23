const JoiInstance = require("../utils/joi-instance");

addNotebookSchema = JoiInstance.object({
  name: JoiInstance.string().min(1),
}).options({ allowUnknown: true });

addNoteSchema = JoiInstance.object({
  question: JoiInstance.string().max(25),
  answer: JoiInstance.string().max(50),
  link: JoiInstance.string().max(10),
  tag: JoiInstance.string().max(10),
}).options({ allowUnknown: true });

addOrRetrieveUserSchema = JoiInstance.object({
  name: JoiInstance.string().required(),
  email: JoiInstance.string().email().required(),
});

module.exports = {
  addNoteSchema,
  addNotebookSchema,
  addOrRetrieveUserSchema,
};
