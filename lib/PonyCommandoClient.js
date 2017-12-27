const {CommandoClient, CommandoClientOptions} = require('discord.js-commando');
const PonyDatabase = require('./PonyDatabase');
const PonyLevels = require('./PonyLevels');

class PonyCommandoClient extends CommandoClient {
    constructor(options) {
        super(options || new CommandoClientOptions());

        this.logger = require('simple-node-logger').createSimpleLogger('bot.log');

        this.database = new PonyDatabase(this);
        this.levels = new PonyLevels(this);
    }
}

module.exports = PonyCommandoClient;