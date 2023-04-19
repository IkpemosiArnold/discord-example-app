const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("genesis")
    .setDescription("Enter the theosis."),
  async execute(interaction) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    await interaction.reply(`Greetings Acolyte, we'll call you ${interaction.user.username}.
        \n${interaction.user.username}, The Ecclesia has allowed you to pick your starting power - choose wisely.
        \nBut first, do you dare to enter the Theoverse ?`);
  },
};
