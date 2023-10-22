const { SlashCommandBuilder } = require("discord.js");

module.exports = new SlashCommandBuilder()
  .setName("경매강제종료")
  .setDescription("경매를 강제로 종료합니다.")
  .addIntegerOption((o) =>
    o
      .setName("경매아이디")
      .setDescription("경매아이디를 입력해 주세요.")
      .setRequired(true)
  );
