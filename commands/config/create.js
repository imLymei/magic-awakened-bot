const fs = require('node:fs');
const { SlashCommandBuilder } = require('discord.js');
const { guilds } = require('../../data.json');
const { clientId } = require('../../config.json');
const { queue_1v1 } = require('../../utils/queue');
const { log_message } = require('../../utils/const');

const logMessage = log_message(queue_1v1, queue_1v1);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Comandos relacionados a criação.')
		.addSubcommand((subCommand) =>
			subCommand
				.setName('fila-log')
				.setDescription('Cria uma nova mensagem com dados das filas')
				.addStringOption((option) =>
					option.setName('channel').setDescription('Canal onde a mensagem sera enviada.')
				)
		),
	async execute(interaction) {
		const guildId = interaction.commandGuildId;
		const options = interaction.options._hoistedOptions;

		switch (interaction.options._subcommand) {
			case 'fila-log':
				let guild = guilds.map((guild) => {
					if (guild.id == guildId) {
						return guild;
					}
				})[0];

				if (guild) {
					const channelId = options[0].value;
					const messageId = guild.queue_log.messageId;
					const channel = interaction.client.channels.cache.get(channelId);

					let data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

					if (messageId != '') {
						channel.messages.fetch(messageId).then((message) => {
							if (message.author.id === clientId) {
								message.delete().catch(console.error);
							}
						});
					}

					channel
						.send(logMessage)
						.then((message) => {
							guild.queue_log.channelId = channelId;
							guild.queue_log.messageId = message.id;
							data.guilds = guilds;

							fs.writeFileSync('./data.json', JSON.stringify(data));
						})
						.catch(console.error);
				}

				break;
		}
	},
};