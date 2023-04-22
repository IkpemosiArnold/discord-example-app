const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} = require("discord.js");
const {
  getAcolytes,
  addGame,
  initGame,
  getGame,
  getAllGames,
} = require("../../game");

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
    const compid = interaction.id;
    const readyAcolytes = getAcolytes();
    const usermove = interaction.options.getString("move");
    let gameID;
    const games = getAllGames();

    /////Check if user already registered
    if (readyAcolytes.some((readyAcolyte) => readyAcolyte.id === userId)) {
      const foundAcolyte = readyAcolytes.find(
        (readyAcolyte) => readyAcolyte.id === userId
      );
      for (const id in games) {
        if (games[id].id.includes(userId)) {
          gameID = games[id].id;
        }
      }

      const activeGame = getGame(gameID);
      console.log(gameID);
      if (gameID) {
        await interaction.reply({
          content: `<${userName}>'s move : ${usermove}`,
        });
      } else {
        await interaction.reply({
          content: `You haven't accepted or made any challenges.\nWhy are you flailing about ?`,
        });
      }
    } else {
      await interaction.reply({
        content: `You do not have the blood of theos flowing through you yet unnamed one.\n Go to the genesis before you try step into the arena.`,
      });
    }
  },
};
