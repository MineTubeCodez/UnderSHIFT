const  {Client, Interaction,EmbedBuilder} = require("discord.js");

module.exports = {
    name: 'serverinfo',
    description: 'Replies with the server info!',
  

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @returns 
     */
    callback: async (client, interaction) => {
      if(!interaction.inGuild()) { 
        interaction.reply({
            ephemeral: true,
            content: 'You can only run this command in a server.'
        });
        return;
      }

      const { guild } = interaction;

      const ServerInfoEmbed = new EmbedBuilder({
        author: { name: guild.name, icon_url: guild.iconURL({ size: 256}) || "https://discord.com/assets/3c6ccb83716d1e4fb91d3082f6b21d77.png"},

        fields:[
            { name: "Owner", value: ((await guild.fetchOwner()).user.tag), inline: true },
            { name: 'Text Channels', value: guild.channels.cache.filter((c) => c.type === 0).toJSON().length, inline: true },
            { name: 'Voice Channels', value: guild.channels.cache.filter((c) => c.type === 2).toJSON().length, inline: true },
            { name: 'Category Channels', value: guild.channels.cache.filter((c) => c.type === 4).toJSON().length, inline: true },
            { name: 'Members', value: guild.memberCount, inline: true },
            { name: 'Roles', value: guild.roles.cache.size, inline: true },
            { name: 'Role List', value: guild.roles.cache.toJSON().join(", ")}
        ],

        footer: {text: `ID: ${guild.id} | Server Created: ${guild.createdAt.toDateString()}`},
      }).setColor('Aqua');

      interaction.reply({
        embeds:[ServerInfoEmbed]
      })
    },
  };
  