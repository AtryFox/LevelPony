class PonyRewards {
    constructor(client) {
        this.client = client;
    }

    getGuildRewards(guild) {
        return new Promise(async (fulfill, reject) => {
            try {
                fulfill(await guild.settings.get('rewards') || new Object());
            } catch (err) {
                reject(err);
            }
        });
    }

    setGuildRewards(guild, rewards) {
        return new Promise(async (fulfill, reject) => {
            try {
                await guild.settings.set('rewards', rewards);
                fulfill();
            } catch (err) {
                reject(err);
            }
        });
    }

    addGuildReward(guild, role, level) {
        return new Promise(async (fulfill, reject) => {
            try {
                let rewards = await this.getGuildRewards(guild);

                if (role.id in rewards) fulfill(false);
                else {
                    rewards[role.id] = level;

                    await this.setGuildRewards(guild, rewards);

                    fulfill(true);
                }
            } catch (err) {
                reject(err);
            }
        });
    }

    async removeGuildReward(guild, role) {
        return new Promise(async (fulfill, reject) => {
            try {
                let rewards = await this.getGuildRewards(guild);

                if (!(role.id in rewards)) fulfill(false);
                else {
                    delete rewards[role.id];

                    await this.setGuildRewards(guild, rewards);

                    fulfill(true);
                }
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = PonyRewards;