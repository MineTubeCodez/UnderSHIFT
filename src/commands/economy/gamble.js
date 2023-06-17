const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    AttachmentBuilder,
  } = require('discord.js');
  const User = require('../../models/User');
  
  module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
      if (!interaction.inGuild()) {
        interaction.reply('You can only run this command inside a server.');
        return;
      }
  
        const amount = Number(interaction.options.get("amount").value)

        if(isNaN(amount)) {
            interaction.reply("Provide a valid number.");
            return;
        }

        if (amount < 10) {
            interaction.reply("You must gamble at least $10")
            return
        }

        let userProfile = await User.findOne({
            userId: interaction.user.id,
            guildId: interaction.guild.id,
        });

        if(!userProfile) {
            interaction.reply("You have no profile. Run /daily to get your profile.")
            return
        }

        if (amount > userProfile.balance) {
            interaction.reply("You dont have enough balance to gamble.")
            return
        }

        console.log(amount)

        const didWin = Math.random() > 0.5;

        if(!didWin) {
            userProfile.balance -= Number(amount);
            await userProfile.save();

            interaction.reply("You didn't win this time. Try again later.");
            return;
        }

        const amountwon = amount;
        userProfile.balance += amountwon;
        await userProfile.save()

        interaction.reply(`🎊 You won +$${amountwon}!\nNew Balance: ${userProfile.balance}`);
    },
  
    name: 'gamble',
    description: "Gamble some of your balance",
    options: [
      {
        name: 'amount',
        description: 'amount to gamble',
        type: ApplicationCommandOptionType.Number,
        required: true
      },
    ],
  };
  