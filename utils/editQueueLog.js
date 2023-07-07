const { log_message } = require('./const');
const getGuildInData = require('./getGuildInData');
const { queue_1v1 } = require('./queue');

module.exports = (client, guildId, length_1v1, length_2v2) => {
	const guild = getGuildInData(guildId);

	const messageId = guild.queue_log.messageId;
	const channelId = guild.queue_log.channelId;
	const channel = client.channels.cache.get(channelId);

	channel.messages
		.fetch(messageId)
		.then((message) => {
			message.edit(log_message(queue_1v1, queue_1v1)).catch(console.error);
		})
		.catch(console.error);
};
