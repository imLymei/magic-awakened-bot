const { SlashCommandBuilder, userMention } = require('discord.js');
const getUserInData = require('../../utils/getUserInData');
const { elos } = require('../../data.json');
const sendUserMessage = require('../../utils/sendUserMessage');

let queue = [];
let matches = [];

const searchInterval = 10000;
const messageInterval = 3000;

let intervalId = null;

function searchPlayers(interaction) {
	if (queue.length > 1) {
		const first = queue[0];

		const opponents = queue.filter((player) => {
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

			const opponentMessage = `Encontramos seu adversário!\n${userMention(first.id)} - Elo: ${
				elos[first.elo].name
			}!\nTe vejo na arena!`;

			const firstMessage = `Encontramos seu adversário!\n${userMention(opponent.id)} - Elo: ${
				elos[opponent.elo].name
			}!\nTe vejo na arena!`;

			sendUserMessage(interaction.client, opponent.id, opponentMessage);

			setTimeout(() => sendUserMessage(interaction.client, first.id, firstMessage), messageInterval);

			queue.shift();
			queue.splice(randomNumber, 1);

			if (intervalId !== null && queue.length < 2) {
				console.log('Ending 1v1 Queue...');
				clearInterval(intervalId);
				intervalId = null;
			}
		}
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('x1')
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
				if (queue.find((player) => player.id === user.id) === undefined) {
					await interaction.reply({
						content: 'Você entrou na fila.',
						ephemeral: true,
					});

					queue.push(user);

					if (intervalId === null && queue.length > 1) {
						console.log('Starting 1v1 Queue...');
						intervalId = setInterval(() => searchPlayers(interaction), searchInterval);
					}
				} else {
					await interaction.reply({
						content: 'Você já está na fila!',
						ephemeral: true,
					});
				}
				break;
			case 'exit':
				if (queue.find((player) => player.id === user.id) === undefined) {
					await interaction.reply({
						content: 'Você não está na fila!',
						ephemeral: true,
					});
				} else {
					await interaction.reply({
						content: 'Você saiu da fila.',
						ephemeral: true,
					});

					queue = queue.filter((player) => player.id !== user.id);

					if (intervalId !== null && queue.length < 2) {
						console.log('Ending 1v1 Queue...');
						clearInterval(intervalId);
						intervalId = null;
					}
				}
				break;
		}
	},
};
