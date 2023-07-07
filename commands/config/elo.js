const fs = require('node:fs');
const { SlashCommandBuilder, userMention } = require('discord.js');
const { guilds } = require('../../data.json');
const { elos } = require('../../data.json');
const { queue_1v1 } = require('../../utils/queue');
const isUserInQueue1v1 = require('../../utils/isUserInQueue1v1');
const { message_elo, cargos_elos } = require('../../utils/const');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('elo')
		.setDescription('Comandos relacionados ao elo.')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('set')
				.setDescription('Muda seu elo.')
				.addStringOption((option) =>
					option
						.setName('elo')
						.setDescription('Qual seu novo elo?')
						.setRequired(true)
						.setChoices(...elos)
				)
				.addStringOption((option) =>
					option
						.setName('categoria')
						.setDescription('Qual categoria?')
						.setRequired(true)
						.setChoices({ name: 'Solo', value: 'solo' }, { name: 'Duo', value: 'duo' })
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('get')
				.setDescription('Pega o elo de alguém')
				.addUserOption((option) =>
					option.setName('jogador').setDescription('Verificar o elo de qual jogador?').setRequired(true)
				)
		),
	async execute(interaction) {
		const options = interaction.options._hoistedOptions;
		const guildId = interaction.commandGuildId;
		const userId = interaction.user.id;

		switch (interaction.options._subcommand) {
			case 'get':
				let target = guilds.map((guild) => {
					if (guild.id == guildId) {
						if (!guild.data[options[0].value]) {
							return undefined;
						}
						return guild.data[options[0].value];
					}
				})[0];

				await interaction.reply({
					embeds: [message_elo(interaction.client.users.cache.get(options[0].value), target)],
				});
				break;
			case 'set':
				if (!isUserInQueue1v1()) {
					const newElo = options[0].value;
					const category = options[1].value;

					const guild = interaction.client.guilds.cache.get(guildId);
					const member = guild.members.cache.get(userId);

					const roles = member.roles.cache;

					roles.forEach(async (role) => {
						if (cargos_elos[category].includes(role.id)) {
							const guildRole = guild.roles.cache.get(role.id);
							await member.roles.remove(guildRole);
						}
					});

					await member.roles.add(cargos_elos[category][newElo]);
					await interaction.reply(
						`Seu elo na categoria ${category} agora é ${elos[newElo].name}, você ainda pode subir muito mais!`
					);

					guilds.map((guild) => {
						if (guild.id == guildId) {
							if (!guild.data[userId]) {
								guild.data[userId] = {
									solo: '0',
									duo: '0',
								};
							}

							guild.data[userId][category] = newElo;
						}
					});

					let data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

					data.guilds = guilds;

					fs.writeFileSync('./data.json', JSON.stringify(data));
				} else {
					await interaction.reply({
						content: 'Saia da fila antes de mudar seu elo!',
						ephemeral: true,
					});
				}
				break;
		}
	},
};
