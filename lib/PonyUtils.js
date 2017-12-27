const {MessageEmbed} = require('discord.js');
const moment = require('moment');
const {stripIndents} = require('common-tags');

class PonyUtils {
    static randomInt(low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    }

    static generateSuccessEmbed(message, title, description) {
        return this.generateEmbed(message, title, description).setColor(0x8ed938);
    }

    static generateFailEmbed(message, title, description) {
        return this.generateEmbed(message, title, description).setColor(0xec3c42);
    }

    static generateInfoEmbed(message, title, description) {
        return this.generateEmbed(message, title, description).setColor(0x389ed9);
    }

    static generateEmbed(message, title, description) {
        return new MessageEmbed({
            title: title,
            description: description || '',
            timestamp: moment().format('LLL'),
            footer: {
                icon_url: message.author.displayAvatarURL(),
                text: message.author.tag
            },
        });
    }

    static async getHelpText(guild) {
        const prefix = guild.commandPrefix || guild.client.commandPrefix;

        const info = await guild.client.getInfo();

        return stripIndents`**LEVEL SYSTEM**
        __Get current level__: \`${prefix}rank\`
        __View leaderboard__: \`${prefix}leaderboard\`
        
        **REWARDS**
        __List all rewards__: \`${prefix}rewards\`
        __Add new reward__: \`${prefix}reward add [role] [level]\`
        __Remove existing reward__: \`${prefix}reward remove [role]\`
        
        **SETTINGS**
        __Change command prefix__: \`${prefix}prefix [new prefix]\`
        __Reset command prefix__: \`${prefix}prefix default\`
        __Disable command prefix__: \`${prefix}prefix none\`
        Note: When you disable the command prefix, you have to prefix all commands with \`@${guild.client.user.tag}\`, eg. \`@${guild.client.user.tag} rank\`.
        
        **OTHER**
        __Help__: \`${prefix}levelhelp\`
        
        **INFORMATION**
        __GitHub Repository__: [DerAtrox/LevelPony](https://github.com/DerAtrox/LevelPony)
        __Version running__: [${info.version}](https://github.com/DerAtrox/LevelPony/commit/${info.version})`;
    }
}

module.exports = PonyUtils;