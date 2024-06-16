const { SlashCommandBuilder } = require("discord.js");

module.exports = new SlashCommandBuilder()
  .setName("추첨")
  .setDescription("현재 채널에서 추첨합니다.");
