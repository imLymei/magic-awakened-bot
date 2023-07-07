module.exports = (client, id, message) => {
	client.users.fetch(id, false).then((user) => user.send(message));
};
