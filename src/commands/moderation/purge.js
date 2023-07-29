const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, ChannelManager } = require('discord.js');
const ms = require('ms');

const Punishment = require("../../models/Punishment");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    let number = interaction.options.get("amount").value;

    const embed = new EmbedBuilder()
    .setColor("Blue")
    .setDescription(`:white_check_mark:  Deleted ${number} messages.`);

    await interaction.channel.bulkDelete(number);

    interaction.reply({
        ephemeral: true,
        embeds:[embed]
    })
  },

  name: 'purge',
  description: 'Deletes messages.',
  options: [
    {
      name: 'amount',
      description: 'How many messages to delete',
      type: ApplicationCommandOptionType.Integer,
      required: true,
    }
  ],
  permissionsRequired: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.ManageMessages],
};
