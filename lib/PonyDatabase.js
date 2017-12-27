const sqlite = require('sqlite');
const path = require('path');
const fs = require('fs');

class PonyDatabase {
    constructor(client) {
        this.client = client;

        sqlite.open(path.join(__dirname, '../data/database.sqlite3')).then((db) => {
            this.connection = db;

            fs.readFile('./lib/setup.sql', 'utf8', async (err, data) => {
                if (err) {
                    return this.client.logger.error(`Failed to open setup sql file: ${err}`);
                }

                try {
                    await this.connection.run(data);
                    this.client.logger.info('Database setup complete...');
                } catch (err) {
                    this.client.logger.error(`Could not setup database: ${err}`);
                }

            });

        }).catch((err) => {
            this.client.logger.error(err);
        });
    }
}

module.exports = PonyDatabase;