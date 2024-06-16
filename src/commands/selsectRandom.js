const roleConfig = require("../utils/roleConfigs");
const { adminRoleId, baroonId } = require("../../config.json");

module.exports = {
  data: require("./commandBuilders/selectRandom"),
  async execute(interaction) {
    try {
      const guild = interaction.guild;
      const channel = interaction.channel;
      let messages = [];
      let lastMessageId = null;

      const commandUser = interaction.user.id;
      const userData = await guild.members.fetch(commandUser);
      const roles = userData.roles.cache.map((role) => role.id);
      if (!roles.includes(adminRoleId))
        return interaction.reply({
          ephemeral: true,
          content: "권한이 없습니다.",
        });

      await interaction.reply("추첨을 시작합니다.");

      const youtubeMembershipRoles = roleConfig.ticketsForRole.map(
        (e) => e.roleId
      );

      let sendingMessage = "";

      const ticketsForRoleMessage = roleConfig.ticketsForRole
        .map((e) => `<@&${e.roleId}> : 티켓 ${e.amount}개`)
        .join(`\n`);
      sendingMessage = ticketsForRoleMessage + `\n==========`;

      while (true) {
        const options = { limit: 100 };
        if (lastMessageId) {
          options.before = lastMessageId;
        }

        const fetchedMessages = await channel.messages.fetch(options);
        if (fetchedMessages.size === 0) {
          break;
        }

        messages = messages.concat(Array.from(fetchedMessages.values()));
        lastMessageId = fetchedMessages.last().id;
      }

      const users = await Promise.all(
        messages
          .filter((e) => e.author.bot === false)
          .filter((e) => e.author.id != baroonId)
          .map(async (e) => {
            const id = e.author.id;
            const userData = await guild.members.fetch(id);
            const roles = userData.roles.cache.map((role) => role.id);
            const userObj = { id, roles };
            return userObj;
          })
      );
      const usersNoDup = [];
      for (let u of users) {
        const existData = usersNoDup.find((e) => e.id === u.id);
        if (existData === undefined) usersNoDup.push(u);
      }
      const matchingRole = usersNoDup.map(({ id, roles }) => {
        let role = [];
        for (let r of roles) {
          if (youtubeMembershipRoles.includes(r)) role.push(r);
        }
        return { id, role };
      });
      const hasRoleUsers = matchingRole
        .filter((e) => e.role.length > 0)
        .map((e) => ({
          id: e.id,
          role: e.role[0],
          tickets: roleConfig.ticketsForRole.find((r) => r.roleId == e.role[0])
            .amount,
        }));

      const randomBox = [];
      for (let u of hasRoleUsers) {
        for (let i = 0; i < u.tickets; i++) {
          randomBox.push(u.id);
        }
      }

      await channel.send(sendingMessage);

      const randomBoxList = randomBox.map((e) => `<@${e}>`).join("\n");
      await channel.send(randomBoxList);

      const selectedIdx = Math.floor(Math.random() * randomBox.length);
      if (randomBox[selectedIdx] === undefined) {
        await channel.send("당첨자가 없습니다.");
        return;
      }

      const selectedMessage = `🎉당첨을 축하합니다!!🎉\n\n<@${randomBox[selectedIdx]}>`;
      await channel.send(selectedMessage);
    } catch (e) {
      console.log(e);
      const message = await interaction.fetchReply();
      return message.reply("오류가 발생했습니다. 다시 시도해 주세요.");
    }
  },
};
