const {
  getShuffledPowers,
  addAcolyte,
  addGame,
  getGame,
  getAcolytes,
  initGame,
  setGameRound,
  addPlayerAction,
} = require("../game");
const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  Events,
} = require("discord.js");

const axios = require("axios");

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
          setGameRound(gameId, "round", 1);
          let actionValue = [
            {
              Round: 1,
              Action: "",
            },
          ];
          addPlayerAction(gameId, "player2", "Actions", actionValue);
          const activeGame = getGame(gameId);
          const player1id = activeGame.id.toString();
          const newID = userId.toString() + player1id;
          console.log(newID);
          activeGame.id = newID;
          console.log(activeGame);
          await interaction.reply({
            content: `The Stage is set`,
          });

          ///Call Arbiter and do intro
          let gameDetails = {
            Acolytes: [
              {
                Name: activeGame["player1"].name,
                Powers: [
                  {
                    Name: activeGame["player1"].power,
                    PowerLevel: 1,
                  },
                ],
                HP: 100,
                Actions: [
                  {
                    Round: 1,
                    Action: "I do stuff with my powers",
                  },
                ],
              },
              {
                Name: activeGame["player2"].name,
                Powers: [
                  {
                    Name: activeGame["player2"].power,
                    PowerLevel: 1,
                  },
                ],
                HP: 100,
                Actions: [
                  {
                    Round: 1,
                    Action: "I do stuff with my power",
                  },
                ],
              },
            ],
            Environment:
              "clear day, moderate temparature, no wind, dry terrain",
            CurrentRound: 1,
          };
          const getIntro = async (gamedetails) => {
            let res = await axios.post(
              "https://aetherarbiter.bowojori7.repl.co/intro",
              gamedetails
            );
            interaction.editReply(res.data);
          };
          getIntro(gameDetails);
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
