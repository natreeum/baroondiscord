const updateAuctionStatus = require("../../prisma/scripts/updateAuctionStatus");
const getAuctionDataWithId = require("../../prisma/scripts/getAuctionDataWithId");
const getBidsWithAucId = require("../../prisma/scripts/getBidsWithAucId");

module.exports = async function (auctionId) {
  try {
    const auctionData = await getAuctionDataWithId(auctionId);
    if (!auctionData) return { code: "noAuc" };

    if (!auctionData.inProgress) return { code: "alreadyDone" };

    const updateAuctionStatusRes = await updateAuctionStatus(auctionId);
    if (updateAuctionStatusRes.inProgress) throw "dbError";

    const bids = (await getBidsWithAucId(auctionId)).sort(
      (a, b) => b.price - a.price
    );
    if (!bids) return { code: "dbError" };

    if (bids.length !== 0) {
      return { code: "bidExist", data: updateAuctionStatusRes, bid: bids[0] };
    } else return { code: "noBid", data: updateAuctionStatusRes };
  } catch (e) {
    return { code: e };
  }
};
