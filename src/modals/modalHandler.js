const bid = require("./bid");
const joinRandGame = require("./joinRandGame");
module.exports = async function (interaction) {
  switch (interaction.customId) {
    case "bidModal":
      await bid(interaction);
      break;
    case "joinrandgame":
      await joinRandGame(interaction);
      break;
  }
};
