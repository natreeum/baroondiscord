const { shouldUseGlobalFetchAndWebSocket } = require("discord.js");
const roleConfig = require("../utils/roleConfigs");

module.exports = {
  data: require("./commandBuilders/selectRandom"),
  async execute(interaction) {
    try {
      await interaction.reply("추첨을 시작합니다.");
      const guild = interaction.guild;
      const channel = interaction.channel;
      let messages = [];
      let lastMessageId = null;

      const youtubeMembershipRoles = roleConfig.ticketsForRole.map(
        (e) => e.roleId
      );

      let sendingMessage = "";

      const ticketsForRoleMessage = roleConfig.ticketsForRole
        .map((e) => `<@&${e.roleId}> : ${e.amount}번`)
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
      console.log(randomBox);

      await channel.send(sendingMessage);

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
