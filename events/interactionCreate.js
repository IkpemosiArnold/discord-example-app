const {
  getShuffledPowers,
  addAcolyte,
  addGame,
  getGame,
  getAcolytes,
} = require("../game");
const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  Events,
} = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`Error executing ${interaction.commandName}`);
        console.error(error);
      }
    } else if (interaction.isButton()) {
      if (interaction.customId === "accept") {
        const selectMenu = new StringSelectMenuBuilder()
          .setCustomId("powerMenu")
          .setPlaceholder("Choose a power")
          .addOptions(getShuffledPowers());

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.reply({
          content: "Select a power:",
          components: [row],
          ephemeral: true,
        });
        await interaction.message.delete();
      } else if (interaction.customId.startsWith("battle_accept_")) {
        const userName = interaction.user.username;
        const userId = interaction.user.id;
        const readyAcolytes = getAcolytes();
        const componentId = interaction.customId;
        const gameId = componentId.replace("battle_accept_", "");

        if (readyAcolytes.some((readyAcolyte) => readyAcolyte.id === userId)) {
          const foundAcolyte = readyAcolytes.find(
            (readyAcolyte) => readyAcolyte.id === userId
          );
          addGame(gameId, "player2", foundAcolyte);
          const activeGame = getGame(gameId);
          console.log(activeGame);
          await interaction.reply({
            content: `The Stage is set`,
          });
        } else {
          await interaction.reply({
            content: `You do not have the blood of theos flowing through you yet unnamed one.\n Go to the genesis before you try step into the arena.`,
          });
        }
      }
    } else if (interaction.isStringSelectMenu()) {
      /////Respond after user selects power
      if (interaction.customId === "powerMenu") {
        ////Create new Acolyte object
        const userName = interaction.user.username;
        const userId = interaction.user.id;
        const selectedPower = interaction.values[0];
        let newAcolyte = {
          id: userId,
          name: userName,
          hp: 1,
          pp: 1,
          power: selectedPower,
        };
        /////Push new Acolyte object to Array
        addAcolyte(newAcolyte);
        interaction.reply({
          content: `Welcome new Acolyte ${userName}, who has been blessed with the gift of ${selectedPower}!`,
        });
      }
      // respond to the select menu
    }
  },
};
