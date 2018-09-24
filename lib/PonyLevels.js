const {CommandoGuild} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const moment = require('moment');
const PonyUtils = require('./PonyUtils');

class PonyLevels {
    constructor(client) {
        this.client = client;
    }

    getLevelExp(level) {
        return 5 * (Math.pow(level, 2)) + 50 * level + 100;
    }

    getLevelFromExp(exp) {
        let level = 0;

        while (exp >= this.getLevelExp(level)) {
            exp -= this.getLevelExp(level);
            level++;
        }

        return level;
    };

    getLevelProgress(exp) {
        let level = 0;

        while (exp >= this.getLevelExp(level)) {
            exp -= this.getLevelExp(level);
            level++;
        }

        return exp;
    };

    getLeaderboard(guild) {
        if (guild instanceof CommandoGuild)
            guild = guild.id;

        return new Promise(async (fulfill, reject) => {
            try {
                fulfill(await this.client.database.connection.all('SELECT * FROM levels WHERE guild = $guild ORDER BY exp DESC', {
                    $guild: guild
                }));
            } catch (err) {
                reject(err);
            }
        });
    }

    getLeaderboardOffset(guild, offset) {
        offset = offset || 0;

        if (guild instanceof CommandoGuild)
            guild = guild.id;

        return new Promise(async (fulfill, reject) => {
            try {
                fulfill(await this.client.database.connection.all('SELECT * FROM levels WHERE guild = $guild ORDER BY exp DESC LIMIT 10 OFFSET $offset', {
                    $guild: guild,
                    $offset: offset
                }));
            } catch (err) {
                reject(err);
            }
        });
    }

    getLeaderboardCount(guild) {
        if (guild instanceof CommandoGuild)
            guild = guild.id;

        return new Promise(async (fulfill, reject) => {
            try {
                fulfill(await this.client.database.connection.get('SELECT COUNT() AS count FROM levels WHERE guild = $guild', {
                    $guild: guild
                }));
            } catch (err) {
                reject(err);
            }
        });
    }


    getGuildMemberExp(member) {
        return new Promise(async (fulfill, reject) => {
            try {
                let data = await this.client.database.connection.get('SELECT * FROM levels WHERE guild = $guild AND user = $user', {
                        $guild: member.guild.id,
                        $user: member.id
                    }) || {guild: member.guild.id, user: member.id, exp: 0};

                fulfill(data);
            } catch (err) {
                reject(err);
            }
        });
    }

    setGuildMemberExp(member, exp) {
        return new Promise(async (fulfill, reject) => {
            try {
                let data = await this.client.database.connection.run('INSERT OR REPLACE INTO levels (guild, user, exp) VALUES ($guild, $user, $exp);', {
                    $guild: member.guild.id,
                    $user: member.id,
                    $exp: exp
                });
                fulfill(data);
            } catch (err) {
                reject(err);
            }
        });
    }

    giveGuildUserExp(member, message) {
        if (moment().diff(member.timeout || 0) < 0)
            return;

        member.timeout = moment().add(1, 'minutes');

        return new Promise(async (fulfill, reject) => {
            try {
                const oldExp = (await this.getGuildMemberExp(member)).exp;
                const oldLvl = this.getLevelFromExp(oldExp);
                const newExp = oldExp + PonyUtils.randomInt(15, 25);
                const newLvl = this.getLevelFromExp(newExp);

                await this.setGuildMemberExp(member, newExp);

                if (oldLvl != newLvl) {
                    await this.updateUserRoles(member, message);
                }

                fulfill();
            } catch (err) {
                reject(err);
            }
        });
    }

    updateUserRoles(member, message, fix) {
        return new Promise(async (fulfill, reject) => {
            try {
                const exp = (await this.getGuildMemberExp(member)).exp;
                const lvl = this.getLevelFromExp(exp);

                if (lvl === 0) return;

                let rewards = await message.client.rewards.getGuildRewards(message.guild);
                let rewardsKeys = Object.keys(rewards);



                if (rewardsKeys.length > 0) {
                    let rolesToAdd = [];

                    rewardsKeys.forEach(async function (key) {
                        if (rewards[key] > lvl) return;

                        if (!member.guild.roles.has(key)) {
                            await member.client.rewards.removeGuildReward(member.guild, key);
                            return member.guild.owner.send({embed: PonyUtils.generateFailEmbed(message, 'Level reward invalid!', `Role with ID \`${key}\` does no longer exist.\nRemoving the reward for you...`)});
                        }

                        if (!member.roles.has(key)) {
                            rolesToAdd.push(key);
                        }

                    });

                    try {
                        await member.roles.add(rolesToAdd);
                    } catch (err) {
                        console.log(err);
                        return member.guild.owner.send({embed: PonyUtils.generateFailEmbed(message, 'Level reward invalid!', `Not enough permissions to assign **${rolesToAdd}** to **${member.user.tag}** on **${member.guild.name}**.`)});
                    }

                    if (fix && rolesToAdd.length > 0)
                        await message.channel.send({embed: PonyUtils.generateSuccessEmbed(message, 'Level fix', `${member} just reached level ${lvl}!`)});
                }

                if (await message.guild.settings.get('message', true) && !fix)
                    await message.channel.send({embed: PonyUtils.generateSuccessEmbed(message, 'Level up!', `${member} just reached level ${lvl}!`)});


                fulfill();
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = PonyLevels;