const {SQLiteProvider} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const {stripIndents} = require('common-tags');
const moment = require('moment');
const path = require('path');
const sqlite = require('sqlite');
const config = require('./data/config.json');

const PonyCommandoClient = require('./lib/PonyCommandoClient');

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

/*client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['levels', 'Levels'],
        ['admin', 'Admin'],
    ])
    .registerCommandsIn(path.join(__dirname, 'commands'));*/

client.on('ready', async () => {
    client.logger.info('Logged in!');
    await client.user.setActivity(`Level Pony`);
});


client.on('guildCreate', async (guild) => {
    if (!guild.available) return;

    const info = await client.getInfo();

    const embed = new MessageEmbed({
        author: {
            name: "Hello, I'm Level Pony!",
            iconURL: client.user.displayAvatarURL()
        },
        description: stripIndents`You've just added me to **${guild.name}**. 
        
        Here is some information about myself:
        
        **LEVEL SYSTEM**
        __Get current level:__ \`${client.commandPrefix}rank\`
        __View leaderboard:__ \`${client.commandPrefix}leaderboard\`
        
        **SETTINGS**
        __Change command prefix:__ \`${client.commandPrefix}prefix [new prefix]\`
        __Reset command prefix:__ \`${client.commandPrefix}prefix default\`
        __Disable command prefix:__ \`${client.commandPrefix}prefix none\`
        Note: When you disable the command prefix, you have to prefix all commands with \`@${client.user.tag}\`, eg. \`@${client.user.tag} rank\`.
        
        **OTHER**
        __Help:__ \`${client.commandPrefix}help\`
        
        **INFORMATION**
        __GitHub Repository:__ [DerAtrox/LevelPony](https://github.com/DerAtrox/LevelPony)
        __Version running:__ [${info.version}](https://github.com/DerAtrox/LevelPony/commit/${info.version})`,

        timestamp: moment().format('LLL'),
        footer: {
            text: client.user.tag
        }
    });

    guild.owner.send({embed});
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