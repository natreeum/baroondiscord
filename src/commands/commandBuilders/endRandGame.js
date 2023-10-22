const { SlashCommandBuilder } = require("discord.js");

module.exports = new SlashCommandBuilder()
  .setName("추첨이벤트강제종료")
  .setDescription("추첨이벤트를 강제로 종료합니다.")
  .addIntegerOption((o) =>
    o
      .setName("추첨이벤트아이디")
      .setDescription("추첨이벤트아이디를 입력해 주세요.")
      .setRequired(true)
  );
