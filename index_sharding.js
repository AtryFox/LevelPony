const {ShardingManager} = require('discord.js');
const config = require('./data/config.json');

const manager = new ShardingManager(`${__dirname}/index.js`, {token: config.TOKEN});

manager.on('shardCreate', shard => console.log(`Successfully launched shard ${shard.id}`));

manager.spawn().then(() => {
    console.log(`Launched ${manager.totalShards} shards...`);
}).catch((err) => {
    console.log(err);
});