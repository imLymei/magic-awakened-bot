const { log_message } = require('./const');
const getGuildInData = require('./getGuildInData');

module.exports = (client, guildId) => {
	const guild = getGuildInData(guildId);

	const messageId = guild.queue_log.messageId;
	const channelId = guild.queue_log.channelId;
	const channel = client.channels.cache.get(channelId);

	channel.messages
		.fetch(messageId)
		.then((message) => {
			message.edit({ embeds: [log_message()] }).catch(console.error);
		})
		.catch(console.error);
};
