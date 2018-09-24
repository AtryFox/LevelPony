const {Command} = require('discord.js-commando');

module.exports = class UpdateCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'update',
            group: 'admin',
            memberName: 'update',
            description: 'Updates all user reward roles on this server. Fixes missing roles.',
            examples: ['update'],
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR']
        });
    }

    async run(message, args) {
        const members = message.guild.members;
        
        members.forEach(member => {
            message.client.levels.updateUserRoles(member, message, true);
        })
    }
};