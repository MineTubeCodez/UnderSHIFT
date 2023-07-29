require('dotenv').config();
const { Client, IntentsBitField, Partials } = require('discord.js');
const mongoose = require('mongoose');
const eventHandler = require('./handlers/eventHandler');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.DirectMessages,
  ],
  partials: [
    Partials.Channel,
    Partials.Message
  ]
});

(async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB.');

    eventHandler(client);

    client.login(process.env.TOKEN);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
})();

(async () => {
  process.openStdin();

  process.stdin.addListener("data",(data) => {
    const message = data.toString();

    console.log("Recieved:" + message)

    if(message == "shutdown") {
      console.log("Shuting down....")
      process.exit(0);
    } else if(message == "error") {
      console.log("Throwing test error...")
      throw new Error("Manual Caused Error")
    }
  }); 
})();