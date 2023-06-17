const { Schema, model } = require('mongoose');

const levelSchema = new Schema({
  punshimentId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  Type: {
    type: String,
    required: true,
  },
  Reason: {
    type: String,
    required: true,
  },
  Duration: {
    type: String
  },
  UserName: {
    type: String,
    required: true
  },
  Discrim: {
    type: String
  }
});

module.exports = model('Punishment', levelSchema);
