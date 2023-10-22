const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 *
 * @param {String} title
 * @param {String} description
 * @param {Number} startPrice
 * @param {UnixTimeStamp} start
 * @param {UnixTimeStamp} end
 * @returns
 */
module.exports = async function newAuction(
  title,
  description,
  startPrice,
  start,
  end,
  channelId,
  bidPrice
) {
  try {
    const dbRes = await prisma.auction.create({
      data: {
        title,
        description,
        startPrice,
        start,
        end,
        channelId,
        bidPrice,
      },
    });
    return dbRes;
  } catch (e) {
    console.log(e);
    return null;
  }
};
