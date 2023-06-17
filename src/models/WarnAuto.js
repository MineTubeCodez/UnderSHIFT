const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  numOfWarns: {
    type: Number,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
});

module.exports = model('WarnAuto', userSchema);
