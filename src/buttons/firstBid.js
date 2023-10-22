const {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder,
} = require("discord.js");
const bid = require("../../prisma/scripts/newBid");
const updateAuctionCurPrice = require("../../prisma/scripts/updateAuctionCurPrice");
const getAuctionDataWithId = require("../../prisma/scripts/getAuctionDataWithId");

module.exports = async function (interaction) {
  try {
    const message = interaction.message;
    const channel = interaction.channel;

    const auctionId = Number(message.embeds[0].fields[0].value.split("#")[1]);
    const auctionData = await getAuctionDataWithId(auctionId);
    if (!auctionData) throw "getAuctionErr";
    // [
    //   { value: '#21', name: '경매ID', inline: false },
    //   { value: '5000₩', name: '시작가격', inline: false },
    //   { value: '<t:1693186900>', name: '시작시간', inline: false },
    //   { value: '<t:1693404000>', name: '종료시간', inline: false }
    // ]

    const curPrice = auctionData.startPrice;
    const newBid = await bid(auctionData.id, interaction.user.id, curPrice);
    if (!newBid) throw "newBidErr";

    const updateAuctionCurPriceRes = await updateAuctionCurPrice(
      auctionId,
      curPrice
    );
    if (!updateAuctionCurPriceRes) throw "updateAuctionErr";

    const embed = new EmbedBuilder()
      .setTitle(`[#${auctionData.id}] ${auctionData.title}`)
      .setDescription(`# ${auctionData.description}`)
      .addFields(
        {
          name: "상위입찰자",
          value: `<@${interaction.user.id}>`,
          inline: true,
        },
        {
          name: "상위입찰가격",
          value: `${updateAuctionCurPriceRes.currentPrice}₩`,
          inline: true,
        },
        {
          name: "입찰단위가격",
          value: `${updateAuctionCurPriceRes.bidPrice}₩`,
        },
        { name: "종료시간", value: `<t:${updateAuctionCurPriceRes.end}>` }
      );

    const bidButton = new ButtonBuilder()
      .setCustomId("bid")
      .setLabel("입찰하기")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(bidButton);

    const files = [];
    if (message.attachments.size !== 0) {
      const key = Array.from(message.attachments.keys());
      files.push(message.attachments.get(key[0]));
    }
    await message.delete();

    await interaction.deferUpdate();
    await channel.send(
      `입찰자 : <@${interaction.user.id}> | 입찰 금액 : ${newBid.price}₩`
    );
    await channel.send({ embeds: [embed], components: [row], files });
  } catch (e) {
    console.log(e);
    return await interaction.reply({
      ephemeral: true,
      content: "버튼 작동에 실패했습니다!",
    });
  }
};
