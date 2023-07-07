const fs = require('node:fs');
const { SlashCommandBuilder, userMention } = require('discord.js');
const { guilds } = require('../../data.json');
const { elos } = require('../../data.json');

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
					option.setName('jogador').setDescription('Qual jogador pegar o elo.').setRequired(true)
				)
		),
	async execute(interaction) {
		const options = interaction.options._hoistedOptions;

		switch (interaction.options._subcommand) {
			case 'get':
				let target = guilds.map((guild) => {
					if (guild.id == interaction.commandGuildId) {
						if (!guild.data[options[0].value]) {
							return undefined;
						}
						return guild.data[options[0].value];
					}
				})[0];

				await interaction.reply(
					`Os elos de ${userMention(options[0].value)} ${
						target
							? `são: \`\`\`solo: ${elos[target.solo].name}\nduo: ${elos[target.duo].name}\`\`\``
							: 'estão indefinidos.'
					}`
				);
				break;
			case 'set':
				const newElo = options[0].value;
				const category = options[1].value;

				await interaction.reply(`Seu elo na categoria ${category} agora é ${newElo}.`);

				guilds.map((guild) => {
					if (guild.id == interaction.commandGuildId) {
						if (!guild.data[interaction.user.id]) {
							guild.data[interaction.user.id] = {
								solo: '0',
								duo: '0',
							};
						}

						guild.data[interaction.user.id][category] = newElo;
					}
				});

				let data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

				data.guilds = guilds;

				fs.writeFileSync('./data.json', JSON.stringify(data));
				break;
		}
	},
};
