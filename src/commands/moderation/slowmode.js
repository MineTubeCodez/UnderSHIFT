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
    const seconds = interaction.options.get('seconds').value;
    const channelId = interaction.options.get('duration')?.value || interaction.channel.id;

    const channel = await interaction.guild.channels.fetch(channelId)

    channel.setRateLimitPerUser(seconds)

    const embed = new EmbedBuilder()
    .setColor("Blue")
    .setDescription(`:white_check_mark: ${channel} now has ${seconds} seconds of **slowmode**.`);

    interaction.reply({
        embeds:[embed]
    })
  },

  name: 'slowmode',
  description: 'Sets/changes the slowmode on this or other channel.',
  options: [
    {
      name: 'seconds',
      description: 'The user you want to timeout.',
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
    {
      name: 'channel',
      description: 'The channel...',
      type: ApplicationCommandOptionType.Channel
    }
  ],
  permissionsRequired: [PermissionFlagsBits.ManageChannels],
  botPermissions: [PermissionFlagsBits.ManageChannels],
};
