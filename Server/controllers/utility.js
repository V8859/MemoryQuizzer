const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

addOrRetrieveUser = async (req, res) => {
  console.log("CALLED");
  const { name, email } = req.body;

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
  if (user) {
    res.json({ id: user.id });
  } else {
    res.json({ res: "DIDNT WORK" });
  }
};

module.exports = { addOrRetrieveUser };
