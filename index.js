const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const command = require('./util/command')


//==========//End Imports//==========//

client.on('ready', () => {
    console.log('The client is ready')

    command(client, ['ping', 'test'], (message) => {
        message.channel.send('Pong!')
    })
    command(client, 'servers', message => {
        client.guilds.cache.forEach((guild) => {
            message.channel.send(`${guild.name} has a total of ${guild.memberCount} members.`)
        })
    })
    command(client, ['cc', 'clearchannel'], message => {
        if(message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.messages.fetch().then((results) => {
                message.channel.bulkDelete(results)
            })
        }
    })
})

client.login(config.token)