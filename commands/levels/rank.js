const {Command} = require('discord.js-commando');

module.exports = class RankCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'rank',
            group: 'levels',
            memberName: 'reply',
            description: 'Replies with a Message.',
            examples: ['reply']
        });
    }

    async run(message) {

    }
};