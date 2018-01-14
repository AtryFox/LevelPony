const {Command} = require('discord.js-commando');
const moment = require('moment');
const PonyUtils = require('../../lib/PonyUtils');

module.exports = class RankCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'leaderboard',
            group: 'levels',
            memberName: 'leaderboard',
            description: 'Displays the leaderboard of the guild',
            examples: ['leaderboard'],
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 1800
            }
        });
    }

    async run(message) {
        const count = await message.client.levels.getLeaderboardCount(message.guild);

        const pages = Math.ceil(count.count / 10) - 1;
        let page = 0;

        async function genData(page) {
            let output = "";

            const data = await message.client.levels.getLeaderboardOffset(message.guild, page * 10);

            data.forEach((row) => {
                row.currentRank = data.indexOf(row) + 1 + page * 10;
                row.currentLevel = message.client.levels.getLevelFromExp(row.exp);
                row.levelExp = message.client.levels.getLevelExp(row.currentLevel);
                row.currentLevelExp = message.client.levels.getLevelProgress(row.exp);

                if (message.guild.members.has(row.user)) {
                    const member = message.guild.members.get(row.user);

                    row.name = `${member} (${member.user.tag})`;
                } else {
                    row.name = 'User left';
                }

                output += `**${row.currentRank}.** __${row.name}__\nLevel: ${row.currentLevel} Exp: ${row.currentLevelExp}/${row.levelExp} (total ${row.exp})\n\n`;
            });

            return output;
        }


        let msg = await message.channel.send({embed: PonyUtils.generateInfoEmbed(message, `Leaderboard (Page ${page + 1}/${pages + 1})`, await genData(page))});

        await message.delete();

        await msg.react('1⃣');
        await msg.react('⬅');
        await msg.react('➡');
        await msg.react('🇽');

        const collector = msg.createReactionCollector(
            (reaction, user) => user.id == message.author.id,
            {time: 120000}
        );

        collector.on('collect', async (r) => {
            r.remove(message.author.id);

            switch (r.emoji.name) {
                case '1⃣':
                    page = 0;

                    break;
                case '➡':
                    if (page >= pages) return;

                    page++;
                    break;
                case '⬅':
                    if (page <= 0) return;

                    page--;
                    break;
                case '🇽':
                    return collector.stop();
            }

            await msg.edit({embed: PonyUtils.generateInfoEmbed(message, `Leaderboard (Page ${page + 1}/${pages + 1})`, await genData(page))});
        });

        collector.on('end', () => {
            msg.delete();
        });
    }
}