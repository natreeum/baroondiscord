const cron = require("node-cron");
const fs = require("node:fs");
const path = require("node:path");
// utils
const getCurTimestamp = require("./src/utils/getCurTimestamp");
const checkAuction = require("./src/utils/checkAuction");

// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const { token } = require("./config.json");

// Create a new client instance
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

// import button Handler
const buttonHandler = require("./src/buttons/buttonHandler");

// import modal Handler
const modalHandler = require("./src/modals/modalHandler");
const checkRandGame = require("./src/utils/checkRandGame");
const checkRoles = require("./src/utils/checkRoles");

// setting commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, "/src/commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

// button handler
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;
  await buttonHandler(interaction);
});

// modal handler
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;
  await modalHandler(interaction);
});

// Log in to Discord with your client's token
client.login(token);

// cronjob
cron.schedule("* * * * *", async () => {
  checkAuction(getCurTimestamp(), client);
  checkRandGame(client);
});

cron.schedule("0 0 * * *", async () => {
  checkRoles(client);
});
