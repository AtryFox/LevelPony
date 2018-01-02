const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const moment = require('moment');
const PonyUtils = require('../../lib/PonyUtils');

module.exports = class RankCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'info',
            group: 'general',
            memberName: 'info',
            description: 'Displays information about this bot.',
            examples: ['info'],
            throttling: {
                usages: 1,
                duration: 1800
            }
        });
    }

    async run(message) {
        const info = await message.client.getInfo();

        const linkLastCommit = `https://github.com/DerAtrox/Bronies.de-DSB/commit/${info.version}`;

        let embed = new MessageEmbed({
            author: {
                name: `DerAtrox/LevelPony@${info.version}`,
                icon_url: message.client.user.displayAvatarURL()
            },
            thumbnail: {
                url: message.client.user.displayAvatarURL()
            },
            description: 'Implemented with the help of [Node.js](https://nodejs.org/) and [discord.js](https://discord.js.org/).',
            fields: [
                {
                    name: 'Version',
                    value: info.version,
                    inline: true
                },
                {
                    name: 'Last Commit',
                    value: `[Open](${linkLastCommit})`,
                    inline: true
                }
            ],
            color: 0x632E86
        }).setFooter(moment().format('LLLL'));

        if ('message' in info) {
            embed.addField('Last Commitmessage', info.message, false);
        }

        if ('timestamp' in info) {
            embed.addField('Commited on', (moment(info.timestamp, 'YYYY-MM-DD HH:mm:ss Z').locale('de').fromNow()), false);
        }

        message.channel.send({embed});
    }
}