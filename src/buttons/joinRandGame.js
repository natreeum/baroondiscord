const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const getUsersByGameId = require("../../prisma/scripts/getUsersByGameId");
const getRandGameWithId = require("../../prisma/scripts/getRandGameWithId");

module.exports = async function (interaction) {
  const eventId = Number(
    interaction.message.content.split("#")[1].split("]")[0]
  );
  const gameData = await getRandGameWithId(eventId);
  if (!gameData)
    return interaction.reply({
      ephemeral: true,
      content: "이미 종료된 이벤트이거나 존재하지 않는 이벤트 입니다.",
    });

  const users = await getUsersByGameId(eventId);
  if (users.filter((e) => e.userId == interaction.user.id).length !== 0) {
    return interaction.reply({
      ephemeral: true,
      content: "이미 참여했습니다!",
    });
  }

  const allowedRoles = gameData.roles.split(" ");
  if (allowedRoles.length) {
    let flag = false;
    for (let r of allowedRoles) {
      if (interaction.member.roles.cache.has(r)) {
        flag = true;
        break;
      }
    }
    if (!flag)
      return interaction.reply({
        ephemeral: true,
        content: "참여가능한 역할을 갖고있지 않습니다!",
      });
  }

  const modal = new ModalBuilder()
    .setCustomId("joinrandgame")
    .setTitle(`[#${eventId}]번 추첨이벤트 참여하기`);

  const modalInput = new TextInputBuilder()
    .setCustomId("joiningcontent")
    .setLabel("문장을 입력하세요.")
    .setStyle(TextInputStyle.Paragraph);

  const row = new ActionRowBuilder().addComponents(modalInput);

  modal.addComponents(row);

  await interaction.showModal(modal);
};
