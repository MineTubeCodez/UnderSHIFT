const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const Guild = require('../../models/Guild');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: 'You can only run this command inside a server.',
        ephemeral: true,
      });
      return;
    }

    const targetUserId = interaction.options.get('channel').value;

    await interaction.deferReply();

    let user = await Guild.findOne({ guildId: interaction.guild.id });

    if (!user) {
      user = new Guild({
        guildId: interaction.guild.id,
        appealChannelId: targetUserId
      });
      user.save();
      interaction.editReply("Appeals have been set up.")
      return;
    }

    user.appealChannelId = targetUserId;
    user.save();

    interaction.editReply(
      "Appeals channel has been edited."
    );
  },

  name: 'appealsetup',
  description: "Sets up appeals.",
  options: [
    {
      name: 'channel',
      description: 'The channel were appeals will be sent to.',
      type: ApplicationCommandOptionType.Channel,
      required: true
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
};
