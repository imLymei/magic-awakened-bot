const { message_1v1, message_duo } = require('../../utils/const');
const editQueueLog = require('../../utils/editQueueLog');
const getUserInData = require('../../utils/getUserInData');
const { duo_search } = require('../../utils/queue');
const sendUserMessage = require('../../utils/sendUserMessage');
const { SlashCommandBuilder } = require('discord.js');

let matches = [];

const searchInterval = 10000;
const messageInterval = 3000;

let intervalId = null;

function searchPlayers(interaction) {
	if (duo_search.length > 1) {
		const first = duo_search[0];

		const opponents = duo_search.filter((player) => {
			if (player.id !== first.id) {
				const diference = parseInt(first.elo) - parseInt(player.elo);

				if (Math.abs(diference) <= 1) {
					return true;
				}
			}
			return false;
		});

		const randomNumber = Math.round(Math.random() * (opponents.length - 1));

		const opponent = opponents[randomNumber];

		if (opponent) {
			sendUserMessage(interaction.client, opponent.id, { embeds: [message_duo(first)] });

			setTimeout(
				() => sendUserMessage(interaction.client, first.id, { embeds: [message_duo(opponent)] }),
				messageInterval
			);

			setTimeout(() => editQueueLog(interaction.client, interaction.commandGuildId), messageInterval / 2);

			duo_search.shift();
			duo_search.splice(randomNumber, 1);

			if (intervalId !== null && duo_search.length < 2) {
				console.log('Ending duo Queue...');
				clearInterval(intervalId);
				intervalId = null;
			}
		}
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('duo')
		.setDescription('Comandos relacionados a 1v1')
		.addSubcommand((subcommand) => subcommand.setName('enter').setDescription('Entrar na fila de duplas.'))
		.addSubcommand((subcommand) => subcommand.setName('exit').setDescription('Sair na fila de duplas.')),
	async execute(interaction) {
		let target = getUserInData(interaction);

		const user = {
			id: interaction.user.id,
			elo: target ? target.solo : '0',
		};

		switch (interaction.options._subcommand) {
			case 'enter':
				if (duo_search.find((player) => player.id === user.id) === undefined) {
					await interaction.reply({
						content: 'Você entrou na fila de duo.',
						ephemeral: true,
					});

					duo_search.push(user);

					if (intervalId === null && duo_search.length > 1) {
						console.log('Starting duo Queue...');
						intervalId = setInterval(() => searchPlayers(interaction), searchInterval);
					}

					editQueueLog(interaction.client, interaction.commandGuildId);
				} else {
					await interaction.reply({
						content: 'Você já está na fila de duo!',
						ephemeral: true,
					});
				}
				break;
			case 'exit':
				if (duo_search.find((player) => player.id === user.id) === undefined) {
					await interaction.reply({
						content: 'Você não está na fila de duo!',
						ephemeral: true,
					});
				} else {
					await interaction.reply({
						content: 'Você saiu da fila de duo.',
						ephemeral: true,
					});

					const userIndex = duo_search.map((player, index) => {
						if (player.id == user.id) {
							return index;
						}
					});

					duo_search.splice(userIndex, 1);

					if (intervalId !== null && duo_search.length < 2) {
						console.log('Ending duo Queue...');
						clearInterval(intervalId);
						intervalId = null;
					}

					editQueueLog(interaction.client, interaction.commandGuildId);
				}
				break;
		}
	},
};
