const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const command = require('./util/command')
const firstMessage = require('./util/first-message')
const pm = require('./util/private-message')

//==========//End Imports//==========//

client.on('ready', () => {
    console.log('The client is ready')

    firstMessage(client, '868293138421284968', 'hello world!!!', ['🔥', '🍉'])
    
    pm(client, 'ping', 'Pong!')

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
    
    command(client, 'status', message => {
        const content = message.content.replace('!status ', '')
        
        client.user.setPresence({
            activity: {
                name: content,
                type: 0
            }
        })
    })
    
    command(client, 'embed', message => {
        const logo = message.guild.iconURL()
        const embed = new Discord.MessageEmbed()
        .setTitle('Example Text')
        .setAuthor("Shin Ma")
        .setURL('https://duckduckgo.com')
        .setThumbnail(logo)
        .setFooter('This is a footer')
        .setColor('#FF0000')
        .addFields(
            {
                name: 'Banned User',
                value: 'Get from command',
                inline: true
            },
            {
                name: 'Ban Message',
                value: 'Get from command',
                inline: true
            },
            {
                name:'Date',
                value: 'GetDate(), getMonth() getFullYear(), on new Date() objecty',
                inline: true
            },
            {
                name:'Moderator',
                value: message.author,

            }
            
            )
        message.channel.send(embed)

    })
})

client.login(config.token)