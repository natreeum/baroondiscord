const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const getAuctionDataWithId = require("../../prisma/scripts/getAuctionDataWithId");

module.exports = async function (interaction) {
  try {
    const message = interaction.message;

    const auctionId = Number(
      message.embeds[0].title.split("#")[1].split("]")[0]
    );
    const auctionData = await getAuctionDataWithId(auctionId);
    if (!auctionData) throw "getAuctionErr";
    if (!auctionData.inProgress) throw "endedAuction";

    const modal = new ModalBuilder()
      .setCustomId("bidModal")
      .setTitle("입찰하기");

    const priceInput = new TextInputBuilder()
      .setCustomId("bidPrice")
      .setLabel(
        `입찰가격을 입력하세요. 현재상위입찰가격 : ${auctionData.currentPrice}, 입찰단위 : ${auctionData.bidPrice}₩`
      )
      .setStyle(TextInputStyle.Short);

    const actionRow = new ActionRowBuilder().addComponents(priceInput);

    modal.addComponents(actionRow);
    await interaction.showModal(modal);
  } catch (e) {
    if (e === "endedAuction")
      return await interaction.reply({
        ephemeral: true,
        content: `종료된 경매입니다!`,
      });
    console.log(e);
    return await interaction.reply({
      ephemeral: true,
      content: "버튼 작동에 실패했습니다!",
    });
  }
};
