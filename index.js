const {SQLiteProvider} = require('discord.js-commando');
const PonyCommandoClient = require('./lib/PonyCommandoClient');
const path = require('path');
const sqlite = require('sqlite');
const config = require('./data/config.json');

const client = new PonyCommandoClient({
    commandPrefix: config.PREFIX,
    owner: config.ADMIN,
    disableEveryone: true,
    disabledEvents: ["TYPING_START"]
});

sqlite.open(path.join(__dirname, "/data/settings.sqlite3")).then((db) => {
    client.setProvider(new SQLiteProvider(db));
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['levels', 'Levels'],
        ['admin', 'Admin'],
    ])
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', async () => {
    client.logger.info('Logged in!');
    await client.user.setActivity('LevelPony');
});

client.on('message', (message) => {
    if (message.author.id === client.user.id) {
        return;
    }

    if (message.channel.type === 'group') {
        return;
    }

    if (message.author.bot) {
        return
    }

    client.levels.giveGuildUserExp(message.guild.members.get(message.author.id), message);
});

client.login(config.TOKEN).catch((err) => {
    client.logger.error(err);
});