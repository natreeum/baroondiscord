const {
  EmbedBuilder,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
} = require("discord.js");
const getAuctionDataWithId = require("../../prisma/scripts/getAuctionDataWithId");
const updateAuctionCurPrice = require("../../prisma/scripts/updateAuctionCurPrice");
const bid = require("../../prisma/scripts/newBid");

module.exports = async function (interaction) {
  const bidPrice = Number(interaction.fields.getTextInputValue("bidPrice"));
  const message = interaction.message;
  const channel = interaction.channel;

  const auctionId = Number(message.embeds[0].title.split("#")[1].split("]")[0]);
  const auctionData = await getAuctionDataWithId(auctionId);
  if (!auctionData) throw "getAuctionErr";
  if (!auctionData.inProgress) throw "endedAuction";
  // [
  //   { value: '#21', name: '경매ID', inline: false },
  //   { value: '5000₩', name: '시작가격', inline: false },
  //   { value: '<t:1693186900>', name: '시작시간', inline: false },
  //   { value: '<t:1693404000>', name: '종료시간', inline: false }
  // ]

  if (bidPrice <= auctionData.currentPrice)
    return interaction.reply({
      ephemeral: true,
      content: `현재 상위입찰가격보다 같거나 낮은 금액으로 입찰할 수 없습니다.`,
    });
  if ((bidPrice - auctionData.currentPrice) % auctionData.bidPrice != 0)
    return interaction.reply({
      ephemeral: true,
      content: `${auctionData.bidPrice}₩ 단위에 맞게 입찰금액을 입력해 주세요.`,
    });

  const curPrice = bidPrice;
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
      { name: "입찰단위가격", value: `${auctionData.bidPrice}₩` },
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
};
