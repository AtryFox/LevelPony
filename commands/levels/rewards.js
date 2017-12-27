const {Command} = require('discord.js-commando');
const PonyUtils = require('../../lib/PonyUtils');

module.exports = class RewardsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'rewards',
            group: 'levels',
            memberName: 'rewards',
            description: 'Lists all rewards',
            examples: ['rewards'],
            guildOnly: true
        });
    }

    async run(message) {
        let rewards = await message.client.rewards.getGuildRewards(message.guild);
        let rewardsKeys = Object.keys(rewards);

        if (rewardsKeys.length == 0) {
            return await message.channel.send({embed: PonyUtils.generateInfoEmbed(message, 'There are no rewards in this guild.')});
        }

        let text = '';

        rewardsKeys.forEach((key) => {
            text += `${message.guild.roles.get(key)}\nLevel: ${rewards[key]}\n\n`;
        });

        await message.channel.send({embed: PonyUtils.generateInfoEmbed(message, 'Rewards', text)});
    }
};