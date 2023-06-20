const { ActivityType, Client, PresenceUpdateStatus } = require("discord.js");

/**
 * 
 * @param {Client} client 
 */

module.exports = (client) => {
    client.user.setActivity({
        name: 'Under Shift',
        type: ActivityType.Playing
    });
    client.user.setStatus("dnd");
};
  