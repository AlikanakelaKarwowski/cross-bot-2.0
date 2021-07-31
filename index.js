const path = require('path')
const fs = require('fs')
const {MongoClient} = require('mongodb')
const {MongoDBProvider} = require('commando-provider-mongo')
const Commando = require('discord.js-commando')

const config = require('./config.json')
const mongo = require('./util/mongoose')
const banList = require('./schemas/banList')

//==========//End Imports//==========//

const client = new Commando.CommandoClient({
    owner: "109314596484939776",
    commandPrefix: config.prefix
});

client.setProvider(
    MongoClient.connect(config.mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((client) => {
        return new MongoDBProvider(client, 'discordbot')
    })
    .catch((err) => {
        console.error(err)
    })
)

client.on('ready', async () => {
    console.log('The client is ready')
    await mongo()
    client.registry
    .registerGroups([
        ['misc', 'misc commands'],
        ['moderation', 'moderation commands'],
        ['setup', 'setup commands']
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'commands'))
})

client.login(config.token)
