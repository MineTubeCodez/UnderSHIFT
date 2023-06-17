const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const WarnAuto = require('../../models/WarnAuto');

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

    const numOfWarns = interaction.options.get('numofwarns').value;
    const action = interaction.options.get('action').value;

    await interaction.deferReply();

    const warnauto = new WarnAuto({
        guildId: interaction.guild.id,
        action: action,
        numOfWarns: numOfWarns,
    });

    warnauto.save();

    interaction.editReply("Task successfully ran.")
  },

  name: 'auto-warn',
  description: "Sets up a basic automation when some reaches num of warns the get action applied to them.",
  options: [
    {
      name: 'numofwarns',
      description: 'The number of warns to trigger this action.',
      type: ApplicationCommandOptionType.Integer,
      required: true
    },
    {
        name: 'action',
        description: 'The action when someone gets the number of warns specified.',
        type: ApplicationCommandOptionType.String,
        choices: [
            {
                name: 'Kick',
                value: 'kick'
            },
            {
                name: 'Ban',
                value: 'ban',
            }
        ],
        required: true
      },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
};
