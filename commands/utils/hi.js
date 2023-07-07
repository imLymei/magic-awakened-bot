const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('hi').setDescription('say hi'),
	async execute(interaction) {
		await interaction.reply('hi!');
	},
};
