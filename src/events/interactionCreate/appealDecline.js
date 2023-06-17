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

  if(interaction.customId.startsWith("declineappeal")) {
    interaction.message.delete()
    interaction.reply('Appeal Declined.')
  }
};
