const fs = require('node:fs');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { guilds } = require('../../data.json');
const { clientId } = require('../../config.json');
const { queue_1v1, queue_2v2 } = require('../../utils/queue');
const { log_message } = require('../../utils/const');
const getGuildInData = require('../../utils/getGuildInData');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Comandos relacionados a criação.')
		.addSubcommand((subCommand) =>
			subCommand
				.setName('fila-log')
				.setDescription('Cria uma nova mensagem com dados das filas')
				.addStringOption((option) =>
					option.setName('channel').setDescription('Canal onde a mensagem sera enviada.').setRequired(true)
				)
		),
	async execute(interaction) {
		const guildId = interaction.commandGuildId;
		const options = interaction.options._hoistedOptions;

		switch (interaction.options._subcommand) {
			case 'fila-log':
				if (interaction.user.id == '303671981440499712') {
					let guild = getGuildInData(guildId);

					if (guild) {
						const oldChannelId = guild.queue_log.channelId;
						const channelId = options[0].value;
						const messageId = guild.queue_log.messageId;
						const channel = interaction.client.channels.cache.get(channelId);

						const logMessage = log_message(queue_1v1, queue_2v2);

						let data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

						if (messageId != '') {
							const oldChannel = interaction.client.channels.cache.get(oldChannelId);

							guild.queue_log.messageId = '';

							oldChannel.messages
								.fetch(messageId)
								.then((message) => {
									if (message.author.id === clientId) {
										message.delete().catch(console.error);
									}

									setTimeout(
										() =>
											channel
												.send({ embeds: [logMessage] })
												.then((message) => {
													guild.queue_log.channelId = channelId;
													guild.queue_log.messageId = message.id;
													data.guilds = guilds;

													fs.writeFileSync('./data.json', JSON.stringify(data));
												})
												.catch(console.error),
										2000
									);
								})
								.catch(console.error);
						} else
							channel
								.send({ embeds: [logMessage] })
								.then((message) => {
									guild.queue_log.channelId = channelId;
									guild.queue_log.messageId = message.id;
									data.guilds = guilds;

									fs.writeFileSync('./data.json', JSON.stringify(data));
								})
								.catch(console.error);
					}
				} else {
					await interaction.reply({
						content: 'Você não tem permissão.',
						ephemeral: true,
					});
				}

				break;
		}
	},
};
