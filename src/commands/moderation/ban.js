const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder
} = require('discord.js');
const Punishment = require("../../models/Punishment");
module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get('target-user').value;
    const reason =
      interaction.options.get('reason')?.value || 'No reason provided';

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply(
        "You can't ban that user because they're the server owner."
      );
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "You can't ban that user because they have the same/higher role than you."
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "I can't ban that user because they have the same/higher role than me."
      );
      return;
    }

    // Ban the targetUser
    try {
      const punishment = new Punishment({
        punshimentId: Math.floor(Math.random() * 1000000),
        guildId: interaction.guild.id,
        userId: targetUser.id,
        Reason: reason,
        Type: "Banned",
        UserName: targetUser.user.username,
        Discrim: targetUser.user?.discriminator || null
      });

      punishment.save();

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

      const appealButton = new ButtonBuilder()
  .setCustomId("appealPunish")
  .setEmoji("💬")
  .setStyle(ButtonStyle.Success)
  .setLabel("Appeal Punishment");

  const row = new ActionRowBuilder()
  .addComponents(appealButton)

      await targetUser.send({
        content: 'Hello, Im here to say that this happened.',
        embeds:[embedToSend],
        components:[row]
      });

      await targetUser.ban({ reason });

      await interaction.editReply(
        `User ${targetUser} was banned\nReason: ${reason}\nPunishment ID: ${punishment.punshimentId}`
      );
    } catch (error) {
      console.log(`There was an error when banning: ${error}`);
    }
  },

  name: 'ban',
  description: 'Bans a member from this server.',
  options: [
    {
      name: 'target-user',
      description: 'The user you want to ban.',
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: 'reason',
      description: 'The reason you want to ban.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],
};
