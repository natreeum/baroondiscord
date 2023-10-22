const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const getRandGameById = require("../../prisma/scripts/getRandGameWithId");
const newRandGamer = require("../../prisma/scripts/newRandGamer");
const nameGenerator = require("../utils/nameGenerator");

module.exports = async function (interaction) {
  try {
    const eventId = Number(
      interaction.message.content.split("#")[1].split("]")[0]
    );
    const randGame = await getRandGameById(eventId);
    if (!randGame)
      return interaction.reply({
        ephemeral: true,
        content: "이미 종료된 이벤트이거나 존재하지 않는 이벤트 입니다.",
      });

    const message = interaction.fields.getTextInputValue("joiningcontent");
    const newGamer = await newRandGamer(eventId, interaction.user.id, message);
    await interaction.message.delete();

    const channel = interaction.channel;

    const joinBtn = new ButtonBuilder()
      .setCustomId("joinrandgame")
      .setLabel("참여하기")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(joinBtn);

    await interaction.deferUpdate();

    await channel.send({
      content: `🔔\n**[#${eventId}]**번 이벤트에 익명의 \`${nameGenerator()}\` 님이 참여했습니다!\n\`\`\`${message}\`\`\``,
    });
    await channel.send({
      content: `**[#${eventId}]**번 추첨이벤트 : \`${randGame.title}\``,
      components: [row],
    });
  } catch (e) {
    return interaction.reply({
      ephemeral: true,
      content: "상호작용에 실패했습니다.",
    });
  }
};
