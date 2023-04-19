import "dotenv/config";
import { getRPSChoices } from "./game.js";
import { capitalize, InstallGlobalCommands } from "./utils.js";

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

const FIGHT_COMMAND = {
  name: "fight",
  description: "Step into the arena",
  type: 1,
};
const ATTACK_COMMAND = {
  name: "attack",
  description: "Step into the arena",
  type: 1,
};
const GENESIS_COMMAND = {
  name: "genesis",
  description: "what is theosis?",
  type: 1,
};

// Command containing options
const CHALLENGE_COMMAND = {
  name: "challenge",
  description: "Challenge to a match of rock paper scissors",
  options: [
    {
      type: 3,
      name: "object",
      description: "Pick your object",
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
};

const ALL_COMMANDS = [
  ATTACK_COMMAND,
  CHALLENGE_COMMAND,
  FIGHT_COMMAND,
  GENESIS_COMMAND,
];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
