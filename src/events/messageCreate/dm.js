const { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');



/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
  if (message.inGuild() || message.author.bot) return;

  if(message.content == "?info") {
    const embed = new EmbedBuilder()
  .setColor('Green')
  .setTitle("Under SHIFT")
  .setDescription("Under Shift is a general purpose discord bot with an moderation, economy system built in.");

  const appealButton = new ButtonBuilder()
  .setCustomId("appealPunish")
  .setEmoji("💬")
  .setStyle(ButtonStyle.Success)
  .setLabel("Appeal Punishment");

  const botButton = new ButtonBuilder()
  .setStyle(ButtonStyle.Link)
  .setLabel("Bot Invite")
  .setURL("https://discord.com/api/oauth2/authorize?client_id=1119317945739382834&permissions=8&scope=applications.commands%20bot");

  const inviteButton = new ButtonBuilder()
  .setStyle(ButtonStyle.Link)
  .setLabel("Primary Server")
  .setURL("https://discord.gg/p7VXU2ScwF")

  const actionRow = new ActionRowBuilder()
  .addComponents(appealButton);

  const actionRow2 = new ActionRowBuilder()
  .addComponents(inviteButton, botButton);

  const newMessage = await message.channel.send(
    {
        content: 'Hello, Heres some info.',
        embeds: [embed],
        components: [actionRow2, actionRow]
    }
  );
  return
  }

  if(message.content == "?joinmyserver") {
    const embed = new EmbedBuilder()
  .setColor('Green')
  .setTitle("Under SHIFT")
  .setDescription("Press the link button below for me to join your server!");

  const botButton = new ButtonBuilder()
  .setStyle(ButtonStyle.Link)
  .setLabel("Bot Invite")
  .setURL("https://discord.com/api/oauth2/authorize?client_id=1119317945739382834&permissions=8&scope=applications.commands%20bot");

  const actionRow2 = new ActionRowBuilder()
  .addComponents(botButton);

  const newMessage = await message.channel.send(
    {
        embeds: [embed],
        components: [actionRow2]
    }
  );
  return
  }

  const embed = new EmbedBuilder()
  .setColor('Red')
  .setTitle("Under SHIFT")
  .setDescription("Unreconginesed Command.")
  .addFields({
    name: 'Commands',
    value: '?info, ?joinmyserver'
  });

  message.channel.send({
    embeds: [embed]
  })
};
