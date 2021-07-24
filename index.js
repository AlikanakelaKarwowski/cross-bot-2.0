const path = require('path')
const fs = require('fs')
const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const command = require('./util/command')
const firstMessage = require('./util/first-message')
const welcome = require('./util/welcome')
const pm = require('./util/private-message')
const mongo = require('./util/mongoose')

//==========//End Imports//==========//

client.on('ready', async () => {
    console.log('The client is ready')
    
    const baseFile = 'command-base.js'
    const commandBase = require(`./commands/${baseFile}`)

    const readCommands = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for (const file of files){
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if (stat.isDirectory()) {
                readCommands(path.join(dir, file))
            } else if (file !== baseFile) {
                const option = require(path.join(__dirname, dir, file))
                commandBase(client, option)
            }
        }
    }
    
    readCommands('commands')
    {
    // await mongo().then(mongoose => {
    //     try {
    //         console.log('Connected to mongodb')
    //     } catch (err) {
    //         console.log(err)
    //     }finally {
    //         mongoose.connection.close()
    //     }
    // })

    // firstMessage(client, '868293138421284968', 'hello world!!!', ['🔥', '🍉'])
    
    // pm(client, 'ping', 'Pong!')

    // command(client, ['ping', 'test'], (message) => {
    //     message.channel.send('Pong!')
    // })
    
    // command(client, 'servers', message => {
    //     client.guilds.cache.forEach((guild) => {
    //         message.channel.send(`${guild.name} has a total of ${guild.memberCount} members.`)
    //     })
    // })
    
    // command(client, ['cc', 'clearchannel'], message => {
    //     if(message.member.hasPermission('ADMINISTRATOR')) {
    //         message.channel.messages.fetch().then((results) => {
    //             message.channel.bulkDelete(results)
    //         })
    //     }
    // })
    
    // command(client, 'status', message => {
    //     const content = message.content.replace('!status ', '')
        
    //     client.user.setPresence({
    //         activity: {
    //             name: content,
    //             type: 0
    //         }
    //     })
    // })
    
    // command(client, 'embed', message => {
    //     const logo = message.guild.iconURL()
    //     const embed = new Discord.MessageEmbed()
    //     .setTitle('Example Text')
    //     .setAuthor("Shin Ma")
    //     .setURL('https://duckduckgo.com')
    //     .setThumbnail(logo)
    //     .setFooter('This is a footer')
    //     .setColor('#FF0000')
    //     .addFields(
    //         {
    //             name: 'Banned User',
    //             value: 'Get from command',
    //             inline: true
    //         },
    //         {
    //             name: 'Ban Message',
    //             value: 'Get from command',
    //             inline: true
    //         },
    //         {
    //             name:'Date',
    //             value: 'GetDate(), getMonth() getFullYear(), on new Date() objecty',
    //             inline: true
    //         },
    //         {
    //             name:'Moderator',
    //             value: message.author,

    //         }
            
    //         )
    //     message.channel.send(embed)

    // })
    
    // welcome(client)
    }
})

client.login(config.token)