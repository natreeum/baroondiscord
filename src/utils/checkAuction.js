const getActiveAuction = require("../../prisma/scripts/getActiveAuction");
const endAuction = require("./endAuction");
const { EmbedBuilder } = require("discord.js");

module.exports = async function (timestamp, client) {
  try {
    const activeAuctions = await getActiveAuction();
    if (activeAuctions.length !== 1) return;
    const auctionData = activeAuctions[0];
    if (Number(auctionData.end) > timestamp) return;
    const res = await endAuction(auctionData.id);
    if (res.code == "noAuc") return;
    if (res.code == "alreadyDone") return;

    const channel = await client.channels.fetch(auctionData.channelId);

    if (res.code == "noBid" || res.code == "bidExist")
      await channel.send(`#${res.data.id} 번 경매가 종료되었습니다.`);
    if (res.code == "bidExist") {
      const winnerEmbed = new EmbedBuilder()
        .setTitle(`#${res.data.id} 번 경매 종료`)
        .setDescription(`## ${res.data.title}\n# ${res.data.description}`)
        .addFields(
          { name: `낙찰자`, value: `<@${res.bid.userId}>` },
          { name: `낙찰 가격`, value: `${res.bid.price}₩` }
        );
      return await channel.send({
        content: `@everyone\n<@${res.bid.userId}>님, 낙찰을 축하합니다!`,
        embeds: [winnerEmbed],
      });
    }
  } catch (e) {
    console.log(e);
  }
};
