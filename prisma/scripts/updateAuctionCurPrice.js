const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = async function updateAuctionCurPrice(id, price) {
  try {
    const dbRes = prisma.auction.update({
      where: { id },
      data: { currentPrice: price },
    });
    return dbRes;
  } catch (e) {
    return null;
  }
};
