const { Client, Interaction } = require('discord.js')
const Punishments = require("../../models/Punishment");
const ban = require('../../commands/moderation/ban');
const punishinfo = require('../../commands/moderation/punishinfo');

/**
 * 
 * @param {Client} client 
 * @param {Interaction} interaction 
 * @returns 
 */
module.exports = async (client, interaction) => {
  if (!interaction.isButton() || !interaction.inGuild()) return;

  if(interaction.customId.startsWith("acceptappeal-")) {
    const punshimentId = interaction.customId.split("-")[1]
    
    const punishment = await Punishments.findOne({ punshimentId: punshimentId });

    if(punishment) {
        if(punishment.Type == "Timeout") {
            const member = await interaction.guild.members.fetch(punishment.userId);

            if(member.isCommunicationDisabled()) {
                member.timeout(null, "Appeal Accepted");
            }

            interaction.message.delete();
            interaction.reply("Punishment Revoked.");

            punishment.delete();

            return;
        }
        
        if(punishment.Type == "Kicked") {
            interaction.message.delete();
            interaction.reply("Punishment Revoked.");

            punishment.delete();

            return;
        }

        if(punishment.Type == "Warn") {
            interaction.message.delete();
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

            interaction.message.delete();
            interaction.reply("Punishment Revoked.");

            punishment.delete();

            return;
        }
    }
  }
};
