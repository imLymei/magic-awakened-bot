const { guilds } = require('../data.json');

module.exports = (interaction) => {
	return guilds.map((guild) => {
		if (guild.id == interaction.commandGuildId) {
			if (!guild.data[interaction.user.id]) {
				return undefined;
			}
			return guild.data[interaction.user.id];
		}
	})[0];
};
