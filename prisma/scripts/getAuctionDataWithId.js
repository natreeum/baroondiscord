const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = async function getAuctionDataWithId(id) {
  try {
    const dbRes = await prisma.auction.findUnique({ where: { id } });
    return dbRes;
  } catch (e) {
    return null;
  }
};
