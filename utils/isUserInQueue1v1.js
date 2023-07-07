const { queue_1v1, duo_search } = require('./queue');

module.exports = (id) => {
	const found_1v1 = queue_1v1.map((player) => {
		if (player.id === id) {
			return player;
		}
	});

	const found_duo = duo_search.map((player) => {
		if (player.id === id) {
			return player;
		}
	});

	const found = [...found_1v1, ...found_duo];

	return found.length > 0 ? true : false;
};
