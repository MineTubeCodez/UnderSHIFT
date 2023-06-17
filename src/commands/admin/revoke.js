const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const Punishments = require('../../models/Punishment');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.isChatInputCommand() || !interaction.inGuild());
  
      const punshimentId = interaction.options.get("punish_id").value;
      
      const punishment = await Punishments.findOne({ punshimentId: punshimentId });
  
      if(punishment) {

        if(!punishment.guildId == interaction.guild.id) return interaction.reply('Must be ran in the guild that created the punishment.');

          if(punishment.Type == "Timeout") {
              const member = await interaction.guild.members.fetch(punishment.userId);
  
              if(member.isCommunicationDisabled()) {
                  member.timeout(null, "Appeal Accepted");
              }
  
              interaction.reply("Punishment Revoked.");
  
              punishment.delete();
  
              return;
          }
          
          if(punishment.Type == "Kicked") {
              interaction.reply("Punishment Revoked.");
  
              punishment.delete();
  
              return;
          }
  
          if(punishment.Type == "Warn") {
              interaction.reply("Punishment Revoked.");
  
              punishment.delete();
  
              return;
          }
  
          if(punishment.Type == "Banned") {
              
              try {
                  interaction.guild.members.unban(punishment.userId, "Appeal Accepted");
              } catch (error) {
                  console.log("error")
              }
  
              interaction.reply("Punishment Revoked.");
  
              punishment.delete();
  
              return;
          }
      } else {
        interaction.reply('Unknow punishment or already revoked.')
      }
  },
  

  name: 'revoke',
  description: "Revoke a punishment.",
  options: [
    {
      name: 'punish_id',
      description: 'punishmentid',
      type: ApplicationCommandOptionType.Integer,
      required: true
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
};
