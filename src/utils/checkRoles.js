class role {
  constructor(id, name) {
    this.roleId = id;
    this.name = name;
  }
}

class roleMatching {
  constructor(r1Id, r2Id) {
    this.role1 = r1Id;
    this.role2 = r2Id;
  }
}

const { resolvePartialEmoji } = require("discord.js");
const config = require("../../config.json");

module.exports = async function checkRoles(client) {
  const youtubeRoles = [
    new role("1224325541361090561", "Youtube Member: TTC타이거 1알"),
    new role("1224325541361090562", "Youtube Member: 흑축 10알"),
    new role("1224325541361090563", "Youtube Member: 흑축 20알"),
    new role("1224325541361090564", "Youtube Member: 흑축 30알"),
  ];
  const manualRoles = [
    new role("1165529959251574966", "[M]TTC타이거 1알"),
    new role("1143585404973494353", "[M]흑축 10알"),
    new role("1143585456106262649", "[M]흑축 20알"),
    new role("1146659499856367746", "[M]흑축 30알"),
  ];
  const matchedRole = [
    new roleMatching("1224325541361090561", "1165529959251574966"),
    new roleMatching("1224325541361090562", "1143585404973494353"),
    new roleMatching("1224325541361090563", "1143585456106262649"),
    new roleMatching("1224325541361090564", "1146659499856367746"),
  ];

  const guild = await client.guilds.fetch(config.guildId);

  const members = await guild.members.fetch();

  const youtubeMembers = [];
  youtubeRoles.forEach((r) => {
    const roleMemberObj = {
      roleId: r.roleId,
      members: members.filter((m) => m.roles.cache.has(r.roleId)),
    };
    youtubeMembers.push(roleMemberObj);
  });

  const manualMembers = [];
  manualRoles.forEach((r) => {
    const roleMemberObj = {
      roleId: r.roleId,
      members: members.filter((m) => m.roles.cache.has(r.roleId)),
    };
    manualMembers.push(roleMemberObj);
  });

  // add role
  const newRoleMembers = [];
  youtubeMembers.forEach((e) => {
    const mems = [];
    const roleId = e.roleId;
    const rolePair = matchedRole.find(
      (r) => r.role1 == roleId || r.role2 == roleId
    );
    e.members.forEach((e) => {
      if (
        !e.roles.cache.has(roleId == rolePair.role1 ? rolePair.role2 : roleId)
      )
        mems.push(e);
    });
    const result = {
      roleId,
      members: mems,
    };
    newRoleMembers.push(result);
  });
  newRoleMembers.forEach((e) => {
    const role = matchedRole.find(
      (mr) => e.roleId == mr.role1 || e.roleId == mr.role2
    );
    e.members.forEach((m) => {
      const addingRole = e.roleId == role.role1 ? role.role2 : e.roleId;
      m.roles.add(addingRole);
    });
  });

  // remove role
  const removedRoleMembers = [];
  manualMembers.forEach((e) => {
    const mems = [];
    const roleId = e.roleId;
    const rolePair = matchedRole.find(
      (r) => r.role1 == roleId || r.role2 == roleId
    );
    e.members.forEach((e) => {
      const role = roleId == rolePair.role1 ? rolePair.role2 : rolePair.role1;
      if (!e.roles.cache.has(role)) mems.push(e);
    });
    removedRoleMembers.push({ roleId, members: mems });
  });
  removedRoleMembers.forEach((e) => {
    const role = matchedRole.find(
      (mr) => e.roleId == mr.role1 || e.roleId == mr.role2
    );
    e.members.forEach((m) => {
      const removingRole = e.roleId == role.role1 ? role.role2 : e.roleId;
      m.roles.remove(removingRole);
    });
  });

  const newRoleMembersData = newRoleMembers.filter((e) => {
    return e.members.length !== 0;
  });
  const channelId = "1143558012162801715";
  const channel = await client.channels.fetch(channelId);
  if (newRoleMembersData.length !== 0)
    await channel.send(
      newRoleMembersData
        .map((e) => {
          return { role: e.roleId, members: e.members.map((e) => e.id) };
        })
        .map((e) => {
          return `<@&${e.role}> \n\n${e.members.reduce((acc, cur) => {
            return acc + `<@${cur}>\n`;
          }, "")}`;
        })
        .reduce((acc, e) => {
          return `${acc}${e}\n\n`;
        }, "**역할 추가됨**\n\n")
    );

  const delRoleMembersData = removedRoleMembers.filter((e) => {
    return e.members.length !== 0;
  });

  if (delRoleMembersData.length !== 0) {
    await channel.send(
      removedRoleMembers
        .map((e) => {
          return { role: e.roleId, members: e.members.map((e) => e.id) };
        })
        .map((e) => {
          return `<@&${e.role}> \n\n${e.members.reduce((acc, cur) => {
            return `${acc}<@${cur}>\n`;
          }, "")}`;
        })
        .reduce((acc, e) => {
          return `${acc}${e}\n\n`;
        }, "**역할 제거됨**\n\n")
    );
  }
};
