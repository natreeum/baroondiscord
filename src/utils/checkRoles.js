const config = require("../../config.json");
const { youtubeRoles, manualRoles, matchedRole } = require("./roleConfigs");

module.exports = async function checkRoles(client) {
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
