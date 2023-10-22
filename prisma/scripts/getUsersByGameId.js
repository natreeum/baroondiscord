const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = async function (id) {
  try {
    const res = await prisma.randGamers.findMany({ where: { gameId: id } });
    return res;
  } catch (e) {
    return null;
  }
};
