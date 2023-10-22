const { SlashCommandBuilder } = require("discord.js");

module.exports = new SlashCommandBuilder()
  .setName("추첨이벤트")
  .setDescription("추첨이벤트를 생성합니다.")
  .addStringOption((o) =>
    o.setName("제목").setDescription("제목을 입력하세요").setRequired(true)
  )
  .addStringOption((o) =>
    o
      .setName("종료일시")
      .setDescription(
        "종료 일시를 입력해주세요. YYYYMMDDhhmm 형식으로 입력하세요."
      )
      .setRequired(true)
  )
  .addStringOption((o) =>
    o
      .setName("참여가능역할")
      .setDescription(
        "참여가 가능한 역할 아이디를 입력하세요. 여러개의 경우 띄어쓰기로 구분해 주세요."
      )
  );
