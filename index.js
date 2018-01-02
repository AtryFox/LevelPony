const {FriendlyError, SQLiteProvider} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const moment = require('moment');
const path = require('path');
const sqlite = require('sqlite');
const config = require('./data/config.json');

const PonyCommandoClient = require('./lib/PonyCommandoClient');
const PonyUtils = require('./lib/PonyUtils');

const client = new PonyCommandoClient({
    commandPrefix: config.PREFIX,
    owner: config.ADMIN,
    disableEveryone: true,
    unknownCommandResponse: false,
    disabledEvents: ["TYPING_START"]
});

sqlite.open(path.join(__dirname, "/data/settings.sqlite3")).then((db) => {
    client.setProvider(new SQLiteProvider(db));
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['general', 'General'],
        ['levels', 'Levels'],
        ['admin', 'Admin']
    ])
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', async () => {
    client.logger.info('Logged in!');
    await client.user.setActivity(`Level Pony`);
});


client.on('guildCreate', async (guild) => {
    if (!guild.available) return;

    const embed = new MessageEmbed({
        author: {
            name: "Hello, I'm Level Pony!",
            iconURL: client.user.displayAvatarURL()
        },
        description: `You've just added me to **${guild.name}**.\n\nHere is some information about myself:\n\n${await PonyUtils.getHelpText(guild)}`,

        timestamp: moment().format('LLL'),
        footer: {
            text: client.user.tag
        }
    });

    guild.owner.send({embed});
});

client.on('message', async (message) => {
    if (message.author.id === client.user.id) {
        return;
    }

    if (message.channel.type === 'group') {
        return;
    }

    if (message.author.bot) {
        return;
    }

    await client.levels.giveGuildUserExp(message.guild.members.get(message.author.id), message);

});

client.on('commandError', (cmd, err) => {
    if (err instanceof FriendlyError) return;
    client.logger.error(`Error in command ${cmd.groupID }: ${cmd.memberName} ${err}`);
});

client.on('commandBlocked', (msg, reason) => {
    client.logger.warn(`Command [${msg.command.groupID}:${msg.command.memberName}] blocked. Reason: ${reason}`);
});

client.login(config.TOKEN).catch((err) => {
    client.logger.error(err);
});