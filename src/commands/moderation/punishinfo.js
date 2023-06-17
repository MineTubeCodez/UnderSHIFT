const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const Punishment = require('../../models/Punishment');

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

    const targetUserId = interaction.options.get('punishid').value;

    const punish = await Punishment.findOne({ punshimentId: targetUserId });

    if (!punish) {
      interaction.editReply(`Punishment id is not valid.`);
      return;
    }

    const embed = new EmbedBuilder()
    .setTitle("Punishment " + punish.Type)
    .setDescription("Punishment in " + client.guilds.cache.get(punish.guildId).name)
    .addFields(
      {
        name: 'User',
        value: punish.Discrim === "0"
        ? punish.UserName
        : `${punish.UserName}#${punish.Discrim}`
      },
        {
            name: 'Reason',
            value: punish.Reason
        }
    )

    if(punish.Type == "Timeout") {
        embed.addFields({
            name: 'Duration',
            value: punish.Duration
        })
    }

    interaction.reply({
        embeds:[embed]
    })
  },

  name: 'punishinfo',
  description: "See yours/someone else's balance",
  options: [
    {
      name: 'punishid',
      description: 'Punishment id.',
      type: ApplicationCommandOptionType.Number,
      required: true
    },
  ],
};
