const {Command} = require('discord.js-commando');
const PonyUtils = require('../../lib/PonyUtils');

module.exports = class RewardsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'levelhelp',
            group: 'general',
            memberName: 'levelhelp',
            description: 'Shows you command usages',
            userPermissions: ['ADMINISTRATOR'],
            examples: ['help'],
            guildOnly: true
        });
    }

    async run(message) {
        await message.author.send(PonyUtils.generateInfoEmbed(message, `Help (in guild \`${message.guild.name}\`)`, await PonyUtils.getHelpText(message.guild)));
        await message.delete();
    }
};