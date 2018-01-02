const {Command} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const moment = require('moment');
const PonyUtils = require('../../lib/PonyUtils');

module.exports = class MessageCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'message',
            group: 'admin',
            memberName: 'message',
            description: 'Enables or disables the levelup message.',
            examples: ['message true', 'message false'],
            args: [
                {
                    key: 'enabled',
                    prompt: 'Do you want to enable (true) or disable (false) the message?',
                    type: 'boolean'
                },
                {
                    key: 'guild',
                    prompt: 'In which guild to you want to enable/disable the message?',
                    default: '',
                    type: 'string',
                    min: 18,
                    max: 18
                }
            ]
        });
    }

    hasPermission(msg) {
        if (!this.client.isOwner(msg.author) && (msg.guild || {}).ownerID != msg.author.id) return 'Only the bot or server owner(s) may use this command.';
        return true;
    }

    async run(message, {enabled, guild}) {
        if (message.guild) {
            message.guild.settings.set('message', enabled);

            return message.channel.send({embed:PonyUtils.generateSuccessEmbed(message, `Set level up message of guild ${message.guild.name} to ${enabled}.`)});
        } else {
            if (!message.client.isOwner(message.author)) return await(message.channel.send({embed: PonyUtils.generateFailEmbed(message, 'No permissions', 'Only bot owner(s) can enable/disable the level up message for another guild.')}));

            if (!guild) return await(message.channel.send({embed: PonyUtils.generateFailEmbed(message, 'No guild specified.')}));

            message.client.provider.set(guild, 'message', enabled);

            return message.channel.send({embed:PonyUtils.generateSuccessEmbed(message, `Set level up message of guild \`${guild}\` to ${enabled}.`)});
        }
    }
}