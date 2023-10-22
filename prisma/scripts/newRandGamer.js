const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = async function newRandGamer(gameId, userId, message) {
  const res = await prisma.randGamers.create({
    data: { gameId, userId, message },
  });
  return res;
};
