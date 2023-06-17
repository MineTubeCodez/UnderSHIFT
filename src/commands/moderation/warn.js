const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const ms = require('ms');

const Punishment = require("../../models/Punishment");
const WarnAuto = require("../../models/WarnAuto");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const mentionable = interaction.options.get('target-user').value;
    const reason = interaction.options.get('reason')?.value || 'No reason provided';

    const targetUser = await interaction.guild.members.fetch(mentionable);
    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }

    if (targetUser.user.bot) {
      await interaction.editReply("I can't warn a bot.");
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply("You can't warn that user because they have the same/higher role than you.");
      return;
    }

    // Timeout the user
    try {
      const punishment = new Punishment({
        punshimentId: Math.floor(Math.random() * 1000000),
        guildId: interaction.guild.id,
        userId: targetUser.id,
        Reason: reason,
        Type: "Warn",
        UserName: targetUser.user.username,
        Discrim: targetUser.user?.discriminator || null
      });

      await punishment.save();

      const embedToSend = new EmbedBuilder()
      .setTitle("Punishment " + punishment.Type)
      .setDescription("You have been punished in " + interaction.guild.name)
      .addFields(
        {
          name: "Punishment Id",
          value: punishment.punshimentId
        },
        {
          name: 'Reason',
          value: punishment.Reason
        }
      );

      targetUser.send({
        content: 'Hello, Im here to say that this happened.',
        embeds:[embedToSend]
      });

      // Auto-Warn procedure

      const punishments = await require("../../utils/getAllBehaviourWithType")(targetUser.id, interaction.guild.id, "Warn");

      const length = punishments.length;
      const actionItem = await WarnAuto.findOne({ guildId: interaction.guild.id, numOfWarns: String(length) });

      let autoModEmbed = undefined;

      console.log(length)

      if(actionItem) {

        if(actionItem.action == undefined) return;
        
        const action = actionItem.action;

        const autoaction = action === "kick"
        ? "Kicked"
        : "Banned"

        const punishment1 = new Punishment({
            punshimentId: Math.floor(Math.random() * 1000000),
            guildId: interaction.guild.id,
            userId: targetUser.id,
            Reason: 'Auto-Mod (Set by an administrator).',
            Type: autoaction,
            UserName: targetUser.user.username,
            Discrim: targetUser.user?.discriminator || null
          });
    
          punishment1.save();
    
          const embedToSend1 = new EmbedBuilder()
          .setTitle("Punishment " + punishment1.Type)
          .setDescription("You have been punished in " + interaction.guild.name)
          .addFields(
            {
              name: "Punishment Id",
              value: punishment1.punshimentId
            },
            {
              name: 'Reason',
              value: punishment1.Reason
            }
          );
    
          await targetUser.send({
            content: 'Hello, Im here to say that this AUTO-MOD came to you.',
            embeds:[embedToSend1]
          });

          autoModEmbed = new EmbedBuilder()
          .setDescription(action === "kick"
            ? "Auto-mod kicked this person."
            : "Auto-mod banned this person."
          ).addFields({
            name: 'Punishment Id',
            value: punishment1.punshimentId
          }, )
          if(action == "kick") {
            targetUser.kick("Auto-Mod");
          }
          if(action == "ban") {
            targetUser.ban({ reason: "Auto-Mod" });
          }
      }

      if (autoModEmbed) {
        await interaction.reply({
            content: `${targetUser} was timed warned.\nReason: ${reason}\nPunishment ID: ${punishment.punshimentId}`,
            embeds:[autoModEmbed]
        });
      } else {
        await interaction.reply(`${targetUser} was timed warned.\nReason: ${reason}\nPunishment ID: ${punishment.punshimentId}`);
      }
    } catch (error) {
      console.log(`There was an error when timing out: ${error}`);
    }
  },

  name: 'warn',
  description: 'warns a user.',
  options: [
    {
      name: 'target-user',
      description: 'The user you want to warn.',
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: 'reason',
      description: 'The reason for the warn.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [PermissionFlagsBits.ModerateMembers],
};
