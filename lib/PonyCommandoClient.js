const {CommandoClient, CommandoClientOptions} = require('discord.js-commando');
const exec = require('child_process').exec;
const PonyDatabase = require('./PonyDatabase');
const PonyLevels = require('./PonyLevels');
const PonyRewards = require('./PonyRewards');

class PonyCommandoClient extends CommandoClient {
    constructor(options) {
        super(options || new CommandoClientOptions());

        this.logger = require('simple-node-logger').createSimpleLogger('bot.log');

        this.database = new PonyDatabase(this);
        this.levels = new PonyLevels(this);
        this.rewards = new PonyRewards(this);
    }

    async getInfo() {
        let client = this;

        let info = {};

        return new Promise((fulfill, reject) => {
            function getVersion() {
                exec('git rev-parse --short=4 HEAD', function (error, version) {
                    if (error) {
                        client.logger.error(`Error getting version ${error}`);
                        info.version = 'unknown';
                    } else {
                        info.version = version.trim();
                    }

                    getMessage();
                });
            }

            function getMessage() {
                exec('git log -1 --pretty=%B', function (error, message) {
                    if (error) {
                        client.logger.error(`Error getting commit message ${error}`);
                        info.message = "Could not get last commit message.";
                    } else {
                        info.message = message.trim();
                    }

                    getTimestamp();
                });
            }

            function getTimestamp() {
                exec('git log -1 --date=short --pretty=format:%ci', function (error, timestamp) {
                    if (error) {
                        client.logger.error(`Error getting creation time ${error}`);
                        info.timestamp = "Not available";
                    } else {
                        info.timestamp = timestamp;
                    }

                    fulfill(info);
                });
            }

            getVersion();
        });
    }
}

module.exports = PonyCommandoClient;