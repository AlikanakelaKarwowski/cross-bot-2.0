const path = require('path')
const fs = require('fs')
// const Discord = require('discord.js')
// const client = new Discord.Client()
const Commando = require('discord.js-commando')

const config = require('./config.json')
const mongo = require('./util/mongoose')
const banList = require('./schemas/banList')

//==========//End Imports//==========//

const client = new Commando.CommandoClient({
    owner: "109314596484939776",
    commandPrefix: config.prefix
});

client.on('ready', async () => {
    console.log('The client is ready')
    
    client.registry
    .registerGroups([
        ['misc', 'misc commands'],
        ['moderation', 'moderation commands']
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'commands'))
})

client.login(config.token)
