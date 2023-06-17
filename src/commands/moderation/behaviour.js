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

    const targetUserId = interaction.options.get('user').value;

    const punishs = await Punishment.find({ userId:targetUserId  });

    if (!punishs) {
      interaction.reply(`User has no punishments`);
      return;
    }

    let embeds = []

    for(i=0;i<punishs.length;i++) {
        let punish = punishs[i]

        const embed = new EmbedBuilder()
    .setTitle("Punishment " + punish.Type)
    .setDescription("Punishment in " + client.guilds.cache.get(punish.guildId).name)
    .addFields(
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
        embed.setColor("Yellow");
    }

    if(punish.Type == "Kicked") {
      embed.setColor("Red");
    }

    if(punish.Type == "Banned") {
      embed.setColor("DarkRed");
    }

    if(punish.Type == "Warn") {
      embed.setColor("Blue");
    }

    embeds.push(embed)
    }

    if(embeds.length == 0) {
      interaction.reply({
        content: 'This user has no recorded behaviour.',
        ephemeral: true,
    })
    } else {
      interaction.reply({
        embeds:embeds,
        ephemeral: true,
    })
    }
  },

  name: 'behaviour',
  description: "See yours/someone else's balance",
  options: [
    {
      name: 'user',
      description: 'Punishment id.',
      type: ApplicationCommandOptionType.User,
      required: true
    },
  ],
};
