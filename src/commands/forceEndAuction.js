const endAuction = require("../utils/endAuction");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: require("./commandBuilders/forceEndAuction"),
  async execute(interaction) {
    try {
      const auctionId = interaction.options.getInteger("경매아이디");
      const res = await endAuction(auctionId);
      if (res.code == "noAuc")
        return interaction.reply({
          ephemeral: true,
          content: `존재하지 않는 경매입니다.`,
        });
      if (res.code == "alreadyDone")
        return interaction.reply({
          ephemeral: true,
          content: `이미 종료된 경매입니다.`,
        });

      if (res.code == "noBid" || res.code == "bidExist")
        await interaction.reply(`#${res.data.id} 번 경매가 종료되었습니다.`);
      if (res.code == "bidExist") {
        const winnerEmbed = new EmbedBuilder()
          .setTitle(`#${res.data.id} 번 경매 종료`)
          .setDescription(`${res.data.description}`)
          .addFields(
            { name: `낙찰자`, value: `<@${res.bid.userId}>` },
            { name: `낙찰 가격`, value: `${res.bid.price}₩` }
          );
        return await interaction.followUp({
          content: `@everyone\n<@${res.bid.userId}>님, 낙찰을 축하합니다!`,
          embeds: [winnerEmbed],
        });
      }
    } catch (e) {
      console.log(e);
    }
  },
};
