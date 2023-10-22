const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = async function updateAuctionStatus(id) {
  try {
    const getAuctionRes = await prisma.auction.findUnique({ where: { id } });
    if (!getAuctionRes) throw "e";

    const dbRes = await prisma.auction.update({
      where: { id },
      data: { inProgress: false },
    });
    return dbRes;
  } catch (e) {
    return null;
  }
};
