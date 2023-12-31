const { message_1v1 } = require('../../utils/const');
const editQueueLog = require('../../utils/editQueueLog');
const getUserInData = require('../../utils/getUserInData');
const { queue_1v1 } = require('../../utils/queue');
const sendUserMessage = require('../../utils/sendUserMessage');
const { SlashCommandBuilder } = require('discord.js');

let matches = [];

const searchInterval = 10000;
const messageInterval = 3000;

let intervalId = null;

function searchPlayers(interaction) {
	if (queue_1v1.length > 1) {
		const first = queue_1v1[0];

		const opponents = queue_1v1.filter((player) => {
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
			console.log(`${first.id} - ${first.elo} vs ${opponent.id} - ${opponent.elo}`);

			sendUserMessage(interaction.client, opponent.id, { embeds: [message_1v1(first)] });

			setTimeout(
				() => sendUserMessage(interaction.client, first.id, { embeds: [message_1v1(opponent)] }),
				messageInterval
			);

			setTimeout(() => editQueueLog(interaction.client, interaction.commandGuildId), messageInterval / 2);

			queue_1v1.shift();
			queue_1v1.splice(randomNumber, 1);

			if (intervalId !== null && queue_1v1.length < 2) {
				console.log('Ending 1v1 Queue...');
				clearInterval(intervalId);
				intervalId = null;
			}
		}
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('1v1')
		.setDescription('Comandos relacionados a 1v1')
		.addSubcommand((subcommand) => subcommand.setName('enter').setDescription('Entra na fila de 1v1.'))
		.addSubcommand((subcommand) => subcommand.setName('exit').setDescription('Sai da fila de 1v1.')),
	async execute(interaction) {
		let target = getUserInData(interaction);

		const user = {
			id: interaction.user.id,
			elo: target ? target.solo : '0',
		};

		switch (interaction.options._subcommand) {
			case 'enter':
				if (queue_1v1.find((player) => player.id === user.id) === undefined) {
					await interaction.reply({
						content: 'Você entrou na fila de 1v1.',
						ephemeral: true,
					});

					queue_1v1.push(user);

					if (intervalId === null && queue_1v1.length > 1) {
						console.log('Starting 1v1 Queue...');
						intervalId = setInterval(() => searchPlayers(interaction), searchInterval);
					}

					editQueueLog(interaction.client, interaction.commandGuildId);
				} else {
					await interaction.reply({
						content: 'Você já está na fila de 1v1!',
						ephemeral: true,
					});
				}
				break;
			case 'exit':
				if (queue_1v1.find((player) => player.id === user.id) === undefined) {
					await interaction.reply({
						content: 'Você não está na fila de 1v1!',
						ephemeral: true,
					});
				} else {
					await interaction.reply({
						content: 'Você saiu da fila de 1v1.',
						ephemeral: true,
					});

					const userIndex = queue_1v1.map((player, index) => {
						if (player.id == user.id) {
							return index;
						}
					});

					queue_1v1.splice(userIndex, 1);

					if (intervalId !== null && queue_1v1.length < 2) {
						console.log('Ending 1v1 Queue...');
						clearInterval(intervalId);
						intervalId = null;
					}

					editQueueLog(interaction.client, interaction.commandGuildId);
				}
				break;
		}
	},
};
