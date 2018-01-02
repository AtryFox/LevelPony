const {Command} = require('discord.js-commando');
const PonyUtils = require('../../lib/PonyUtils');

module.exports = class RewardsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'reward',
            group: 'admin',
            memberName: 'reward',
            description: 'Manages the reward system',
            examples: ['reward add RewardRole 10', 'reward remove Another 15'],
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    key: 'option',
                    prompt: 'What do you want to do? (add/remove)',
                    type: 'string',
                    validate: option => {
                        if (option == 'add' || option == 'remove') return true;
                        return 'Unvalid option selected';
                    }
                },
                {
                    key: 'role',
                    prompt: 'Which role should the reward be?',
                    type: 'role'
                },
                {
                    key: 'level',
                    prompt: 'With which level do you get this reward?',
                    type: 'integer',
                    default: 0
                }
            ]
        });
    }

    async run(message, {option, role, level}) {
        if (option == 'add') {
            if (await this.client.rewards.addGuildReward(message.guild, role, level)) {
                await message.channel.send({embed: PonyUtils.generateSuccessEmbed(message, 'Reward added!', `__Role__: ${role}\n__Level__: ${level}`)});
            } else {
                return await message.channel.send({embed: PonyUtils.generateFailEmbed(message, 'Role is already a reward!')});
            }
        } else {
            if (await this.client.rewards.removeGuildReward(message.guild, role)) {
                await message.channel.send({embed: PonyUtils.generateSuccessEmbed(message, 'Reward removed!')});
            } else {
                return await message.channel.send({embed: PonyUtils.generateFailEmbed(message, 'Role is not a reward!')});
            }
        }
    }
};