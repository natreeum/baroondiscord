const fBid = require("./firstBid");
const bid = require("./bid");
const joinRandGame = require("./joinRandGame");

module.exports = async function (interaction) {
  switch (interaction.customId) {
    case "first_bid":
      await fBid(interaction);
      break;
    case "bid":
      await bid(interaction);
      break;
    case "joinrandgame":
      await joinRandGame(interaction);
      break;
  }
};
