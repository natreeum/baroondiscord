const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const newRandGame = require("../../prisma/scripts/newRandGame");
const getRandGameWithChannel = require("../../prisma/scripts/getRandGameWithChannel");

module.exports = {
  data: require("./commandBuilders/newRandGame"),
  async execute(interaction) {
    try {
      const title = interaction.options.getString("제목");
      const endsAt = interaction.options.getString("종료일시");
      const allowedRoles = interaction.options.getString("참여가능역할") ?? "";
      let roles = allowedRoles.length ? allowedRoles : "";
      for (let i of roles.split(" "))
        if (i.length !== 19)
          return interaction.reply({
            ephemeral: true,
            content: `참여가능역할을 다시 확인해 주세요.`,
          });

      if (endsAt.length !== 12)
        return await interaction.reply({
          ephemeral: true,
          content: "날짜 형식을 참고해서 다시 입력하세요.",
        });

      const endYear = Number(endsAt.substr(0, 4));
      const endMonth = Number(endsAt.substr(4, 2)) - 1;
      const endDate = Number(endsAt.substr(6, 2));
      const endHour = Number(endsAt.substr(8, 2));
      const endMinute = Number(endsAt.substr(10, 2));

      const startTimeUnixTimestamp = Math.floor(new Date().getTime() / 1000);
      const endTime = new Date(endYear, endMonth, endDate, endHour, endMinute);
      const endTimeUnixTimestamp = Math.floor(endTime.getTime() / 1000);
      if (startTimeUnixTimestamp >= endTimeUnixTimestamp) {
        return await interaction.reply({
          ephemeral: true,
          content: `현재시간보다 더 빠른 시간을 종료시간으로 지정할 수 없습니다.`,
        });
      }

      const randGame = await getRandGameWithChannel(interaction.channel.id);
      if (randGame.filter((e) => e.inProgress).length !== 0)
        return interaction.reply({
          ephemeral: true,
          content: "이 채널에는 이미 진행중인 추첨 이벤트가 있습니다.",
        });

      const joinBtn = new ButtonBuilder()
        .setCustomId("joinrandgame")
        .setLabel("참여하기")
        .setStyle(ButtonStyle.Success);

      const row = new ActionRowBuilder().addComponents(joinBtn);

      const createGameRes = await newRandGame(
        title,
        endsAt,
        interaction.channel.id,
        roles
      );
      const channel = interaction.channel;
      let message = `[#${createGameRes.id}]번 추첨이벤트가 생성되었습니다!\n\`\`\`${createGameRes.title}\`\`\``;
      if (createGameRes.roles.length) {
        message += `\n참여가능역할 : `;
        for (r of createGameRes.roles.split(" ")) {
          message += `<@&${r}>`;
        }
      }
      await channel.send({
        content: message,
        components: [row],
      });
      await interaction.reply({
        ephemeral: true,
        content: `추첨이벤트 생성에 성공했습니다.\n\n**추첨이벤트 아이디 : [#${createGameRes.id}]**`,
      });
    } catch (e) {
      console.log(e);
      return await interaction.reply({
        ephemeral: true,
        content: "추첨 이벤트 생성에 실패했습니다.",
      });
    }
  },
};
