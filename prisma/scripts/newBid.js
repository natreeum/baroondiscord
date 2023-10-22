const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = async function newBid(auctionId, userId, price) {
  try {
    const res = await prisma.bid.create({ data: { auctionId, userId, price } });
    return res;
  } catch (e) {
    return null;
  }
};
