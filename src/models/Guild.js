const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  appealChannelId: {
    type: String,
    required: true,
  },
});

module.exports = model('Guild', userSchema);
