const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} = require("discord.js");
const { getAcolytes, addGame, initGame } = require("../../game");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("attack")
    .setDescription("Make your moves, go for the win.")
    .addStringOption((option) =>
      option
        .setName("move")
        .setDescription("Your well-thought out move")
        .setRequired(true)
    ),
  async execute(interaction) {
    const userName = interaction.user.username;
    const userId = interaction.user.id;
    const id = interaction.id;
    const readyAcolytes = getAcolytes();
    const usermove = interaction.options.getString("move");

    /////Check if user already registered
    if (readyAcolytes.some((readyAcolyte) => readyAcolyte.id === userId)) {
      const foundAcolyte = readyAcolytes.find(
        (readyAcolyte) => readyAcolyte.id === userId
      );
      await interaction.reply({
        content: `<${userName}>'s move : ${usermove}`,
      });
    } else {
      await interaction.reply({
        content: `You do not have the blood of theos flowing through you yet unnamed one.\n Go to the genesis before you try step into the arena.`,
      });
    }
  },
};
