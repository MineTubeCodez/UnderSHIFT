const Punishments = require("../models/Punishment");

module.exports = async (userId, guildId, type) => {
    const Punishs = Punishments.find({ userId, guildId, Type: type  });
    return Punishs;
}