const endRandGame = require("../utils/endRandGame");

module.exports = {
  data: require("./commandBuilders/endRandGame"),
  async execute(interaction) {
    try {
      const gameId = interaction.options.getInteger("추첨이벤트아이디");

      const res = await endRandGame(gameId);
      switch (res.code) {
        case "alreadyEnd":
          return interaction.reply({
            ephemeral: true,
            content: `[#${gameId}]번 이벤트는 이미 종료되었습니다.`,
          });
        case "noGamer":
          return interaction.reply(
            `[#${gameId}]번 이벤트는 참여자 없이 종료되었습니다.`
          );
        case "success":
          return interaction.reply(
            `[#${gameId}]번 이벤트의 당첨자는 <@${res.data.userId}>입니다!!`
          );
        default:
          deferUpdate;
      }
    } catch (e) {
      console.log(e);
    }
  },
};
