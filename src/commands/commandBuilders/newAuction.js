const { SlashCommandBuilder } = require("discord.js");

module.exports = new SlashCommandBuilder()
  .setName("경매시작")
  .setDescription("경매를 시작합니다.")
  .addStringOption((o) =>
    o.setName("제목").setDescription("제목을 입력하세요.").setRequired(true)
  )
  .addStringOption((o) =>
    o.setName("설명").setDescription("설명을 입력하세요.").setRequired(true)
  )
  .addIntegerOption((o) =>
    o
      .setName("시작가격")
      .setDescription("시작 가격을 입력해주세요.")
      .setRequired(true)
  )
  .addStringOption((o) =>
    o
      .setName("종료일시")
      .setDescription("YYYYMMDDHHmm 형식으로 입력해 주세요.")
      .setRequired(true)
  )
  .addIntegerOption((o) =>
    o.setName("입찰단위").setDescription("입찰 단위가격을 입력하세요.")
  )
  .addAttachmentOption((o) =>
    o.setName("사진").setDescription("사진을 선택합니다.")
  );
