const { EmbedBuilder, Client, Interaction } = require("discord.js")

module.exports = {
    name: 'shutdown',
    description: 'Kills the process (DEV ONLY)',
    devOnly: true,

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
  
    callback: async (client, interaction) => {
      const embed = new EmbedBuilder()
      .setColor("DarkRed")
      .setDescription("🛠️ Your bot has been shutdown.");

      await interaction.reply({ content: `🔃 Shuting down your discord bot....`, ephemeral: true });
      client.user.setStatus("invisible");

      setTimeout(async () => {
        await interaction.editReply({content: '', embeds:[embed]});
        process.exit(0);
      }, 2000)
    },
  };
  