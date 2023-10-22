const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = async function (channelId) {
  try {
    const res = await prisma.randGame.findMany({ where: { channelId } });
    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
};
