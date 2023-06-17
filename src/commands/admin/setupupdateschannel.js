const { Client, Interaction, ApplicationCommandOptionType } = require("discord.js")
const { updatesChannelId } = require("../../../config.json")

module.exports = {
    name: 'updates',
    description: 'Sets up the updates channel.',
  
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        const channelId = interaction.options.get("channel").value;
        const channel = await interaction.guild.channels.fetch(channelId);
        const updateChannel = await client.channels.fetch(updatesChannelId);

        updateChannel.addFollower(channel, "Updates!");

        interaction.reply("Added.")
    },

    options: [
        {
          name: 'channel',
          description: 'channel to get updates.',
          type: ApplicationCommandOptionType.Channel,
        },
      ],
  };
  