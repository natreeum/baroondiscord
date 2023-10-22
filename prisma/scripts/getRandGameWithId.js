const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = async function (id) {
  try {
    const res = await prisma.randGame.findUnique({ where: { id } });
    return res;
  } catch (e) {
    return null;
  }
};
