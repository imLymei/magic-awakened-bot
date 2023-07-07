const { guilds } = require('../data.json');

module.exports = (guildId) => {
	return guilds.map((guild) => {
		if (guild.id == guildId) {
			return guild;
		}
	})[0];
};
