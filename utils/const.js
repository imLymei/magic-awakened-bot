const { elos } = require('../data.json');
const { EmbedBuilder } = require('discord.js');
const { queue_1v1, queue_2v2, duo_search } = require('./queue');

module.exports = {
	log_message: () => {
		return new EmbedBuilder()
			.setColor(0xd5ab48)
			.setTitle('Status das Filas')
			.setThumbnail('https://cdn.mmoculture.com/mmo-images/2021/06/Harry-Potter-Magic-Awakened-artwork-2.jpg')
			.setDescription(
				'Preparado para se tornar o mago mais forte? Mostre que você é o melhor de todos na arena!'
			)
			.addFields(
				{ name: 'Fila 1v1', value: `${queue_1v1.length} jogadores`, inline: true },
				{ name: 'Fila 2v2', value: `${queue_2v2.length} jogadores`, inline: true },
				{ name: 'Procurando dupla', value: `${duo_search.length} jogadores`, inline: true },
				{ name: 'Floresta', value: 'Em breve.', inline: true },
				{ name: 'Dormitório', value: 'Em breve.', inline: true },
				{ name: 'Dança', value: 'Em breve.', inline: true }
			)
			.setTimestamp()
			.setFooter({
				text: 'Desperta a Magia!',
				iconURL:
					'https://conteudo.imguol.com.br/c/entretenimento/1d/2022/02/11/harry-potter-desperta-a-magia-icone-1644593578458_v2_4x3.png',
			});
	},
	message_1v1: (away) => {
		return new EmbedBuilder()
			.setColor(0xd57048)
			.setTitle('Partida encontrada!')
			.setThumbnail('https://cdn.mmoculture.com/mmo-images/2021/06/Harry-Potter-Magic-Awakened-artwork-2.jpg')
			.setDescription('Encontramos um adversário digno do seu nível!')
			.addFields({ name: `Um desafiante ${elos[away.elo].name}`, value: `<@!${away.id}>` })
			.setTimestamp()
			.setFooter({
				text: 'Desperta a Magia!',
				iconURL:
					'https://conteudo.imguol.com.br/c/entretenimento/1d/2022/02/11/harry-potter-desperta-a-magia-icone-1644593578458_v2_4x3.png',
			});
	},
	message_duo: (away) => {
		return new EmbedBuilder()
			.setColor(0x98d548)
			.setTitle('Aliado encontrado!')
			.setThumbnail('https://portalpopline.com.br/wp-content/uploads/2022/04/harry-potter-game.jpg')
			.setDescription('Encontramos um aliado digno da sua confiança e habilidade!')
			.addFields({ name: `Um dos melhores ${elos[away.elo].name}s`, value: `<@!${away.id}>` })
			.setTimestamp()
			.setFooter({
				text: 'Desperta a Magia!',
				iconURL:
					'https://conteudo.imguol.com.br/c/entretenimento/1d/2022/02/11/harry-potter-desperta-a-magia-icone-1644593578458_v2_4x3.png',
			});
	},
	message_elo: (user, data) => {
		return new EmbedBuilder()
			.setColor(0x98d548)
			.setTitle('Como voce e incrivel!')
			.setThumbnail(
				'https://p2.trrsf.com/image/fget/cf/1200/675/middle/images.terra.com/2023/06/28/harry-potter-desperta-a-magia-s12u93y8bfj8-u7ulv6dgkm75.jpg'
			)
			.setDescription(`Com esses ranks incríveis, <@!${user.id}>, você com certeza é o mestre da magia!`)
			.addFields(
				{ name: 'Solo', value: `${elos[data.solo].name}`, inline: true },
				{ name: 'Duo', value: `${elos[data.duo].name}`, inline: true }
			)
			.setTimestamp()
			.setFooter({
				text: 'Desperta a Magia!',
				iconURL:
					'https://conteudo.imguol.com.br/c/entretenimento/1d/2022/02/11/harry-potter-desperta-a-magia-icone-1644593578458_v2_4x3.png',
			});
	},
	cargos_elos: {
		solo: ['', '', '', '', '', '1126801577513058397', '1126801775807184928', ''],
		duo: ['', '', '', '', '', '1126801671549366393', '1126801840856641578', ''],
	},
};
