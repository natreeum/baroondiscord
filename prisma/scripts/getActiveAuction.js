const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = async function getActiveAuction() {
  try {
    const active = await prisma.auction.findMany({
      where: { inProgress: true },
    });
    return active;
  } catch (e) {
    return null;
  }
};
