const { Client, Interaction, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, SnowflakeUtil } = require('discord.js');

const Guild = require("../../models/Guild");
const Punishments = require("../../models/Punishment");

/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */
module.exports = async (client, interaction) => {
  if (interaction.inGuild() || !interaction.isButton()) return;

  if(interaction.customId == "appealPunish") {
    const modal = new ModalBuilder({
        custom_id: `appeal-${interaction.user.id}`,
        title: 'Appeal Punishment',
    });

    const punishment_id_input = new TextInputBuilder({
        custom_id: 'id',
        label: 'Punishment Id',
        style: TextInputStyle.Short,
    });

    const reason_input = new TextInputBuilder({
        custom_id: 'reason',
        label: 'Reason for appeal',
        style: TextInputStyle.Paragraph,
    });

    const firstActionRow = new ActionRowBuilder().addComponents(punishment_id_input);
    const secondActionRow = new ActionRowBuilder().addComponents(reason_input);

    modal.addComponents(firstActionRow, secondActionRow);

    await interaction.showModal(modal);

    const filter = (interaction) => interaction.customId == `appeal-${interaction.user.id}`;

    await interaction.awaitModalSubmit({filter, time:30_000})
    .then( async (modalInteraction) => {
        const punishId = modalInteraction.fields.getTextInputValue('id');
        const reason = modalInteraction.fields.getTextInputValue("reason");

        const punishment = await Punishments.findOne({ punshimentId: punishId });

        

        if(punishment == null || punishment == undefined) {
            modalInteraction.reply("Punishment not valid");
            return;
        }

        const guildInformation = await Guild.findOne({ guildId: punishment.guildId })

        console.log(guildInformation)

        if(guildInformation == undefined || guildInformation == null) {
            modalInteraction.reply("Guild has not setup appeals.");
            return;
        }

        const embed = new EmbedBuilder()
        .setColor('DarkRed')
        .setTitle("Appeal Punishment " + punishment.Type)
        .setDescription(
            punishment.Discrm === "0"
            ? `${punishment.UserName} has sent an appeal.`
            : `${punishment.UserName}#${punishment.Discrm} has sent an appeal.`
        )
        .addFields({
            name: 'Reason',
            value: reason
        }, {
            name: 'Punishment Id',
            value: punishId
        }, {
            name: 'Suspected Reason',
            value: punishment.Reason
        }, {
            name: 'User',
            value: punishment.Discrim === "0"
            ? punishment.UserName
            : `${punishment.UserName}#${punishment.Discrim}`
        });

        const acceptButton = new ButtonBuilder()
        .setCustomId("acceptappeal-" + punishId)
        .setStyle(ButtonStyle.Success)
        .setLabel('Accept Appeal')
        .setEmoji('✅');

        const declineButton = new ButtonBuilder()
        .setCustomId("declineappeal")
        .setStyle(ButtonStyle.Danger)
        .setLabel('Decline Appeal')
        .setEmoji('❌');

        const row = new ActionRowBuilder().addComponents(acceptButton, declineButton);

        const channel = await client.channels.fetch(guildInformation.appealChannelId);
        channel.send({
            content: 'New Appeal',
            embeds: [embed],
            components: [row]
        });

        modalInteraction.reply("Sent to server.")
    })
    .catch((error) => {
        console.log("there was an error: " + error)
    })
  }
};
