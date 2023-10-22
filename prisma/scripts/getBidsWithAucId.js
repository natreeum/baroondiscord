const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = async function (auctionId) {
  try {
    const dbRes = await prisma.bid.findMany({
      where: {
        auctionId,
      },
    });
    return dbRes;
  } catch (e) {
    return null;
  }
};
