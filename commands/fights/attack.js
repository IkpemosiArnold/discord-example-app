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
  getGameRound,
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
    let gameDetails = {};
    const games = getAllGames();

    /////Check if user already registered
    if (readyAcolytes.some((readyAcolyte) => readyAcolyte.id === userId)) {
      /////get current acolyte
      const foundAcolyte = readyAcolytes.find(
        (readyAcolyte) => readyAcolyte.id === userId
      );

      ////get game id
      for (const id in games) {
        if (games[id].id.includes(userId)) {
          gameID = games[id].id;
        }
      }
      //get game
      const activeGame = getGame(gameID);

      //get game current round
      const currentRound = getGameRound(gameID);

      //check if game exists
      if (gameID) {
        //check if both players have made moves in the current round

        //check which player it is that made the move
        if (activeGame["player1"].id === userId) {
          activeGame["player1"] = usermove;
        } else if (activeGame["player2"].id === userId) {
          activeGame["player2move"] = usermove;
        }

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
