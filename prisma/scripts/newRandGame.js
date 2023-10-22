const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = async function newRandGame(title, end, channelId, roles) {
  try {
    const res = await prisma.randGame.create({
      data: { title, end: end, channelId, roles },
    });
    return res;
  } catch (e) {
    return null;
  }
};
