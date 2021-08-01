const path = require('path')
const fs = require('fs')
const {MongoClient} = require('mongodb')
const {MongoDBProvider} = require('commando-provider-mongo')
const Commando = require('discord.js-commando')

const config = require('./config.json')
const mongo = require('./util/mongoose')
const banList = require('./schemas/banList')
const roleList = require('./schemas/roleList')
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
    
    let guild_ids = client.guilds.cache.map(guild => guild.id)
    let roles = {}
    for(let guild_id of guild_ids) {
        roles[guild_id] = await roleList.find({Guild_id: guild_id})
    }
    client.roleCache = roles
    //console.log(client.registry)
})
client.on('guildMemberAdd', async(message) => {
    

} )
client.login(config.token)
