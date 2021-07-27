const mongo = require('../../util/mongoose')
const Discord = require('discord.js')
const banList = require('../../schemas/banList')
module.exports = {
    commands:'ban',
    minArgs: 2,
    expectedArgs: "<Users ID or @> <reason>",
    requiredRoles: [],
    callback: async (message, arguments) => {
        const target = message.mentions.users.first()
        if(target) {
            const con = await mongo()
            const Discord_id = target.id
            const User = target.username || "N/A"
            arguments.shift()
            const Reason = arguments.join(' ')
            
            const Moderator = message.author.username
            const Server = message.guild.name
            const ban = new banList({
                Discord_id,
                User,
                Reason,
                Moderator,
                Server,
            })

            try{
                await ban.save()  
            }catch (err) {
                console.log(err)
            } finally {
                con.connection.close()
            }
            
            const embed = new Discord.MessageEmbed()
            .setTitle(`${User} Banned`)
            .setAuthor(Moderator)
            .setFooter(`ID:${Discord_id}\t Cross Bot 2.0`)
            .setColor('#FFOOOO')
            .addFields(
                {
                    name: "User",
                    value: `${User}`,
                    inline: true
                },
                {
                    name: "Reason",
                    value: Reason,
                    inline: true
                },
                {
                    name: "Moderator",
                    value: Moderator,
                    inline: true
                }   
            )
            message.channel.send(embed)


        } else {
            const con = await mongo()
            const Discord_id = arguments[0]
            const member = await message.guild.members.fetch(Discord_id)
            console.log(member)
            if(member) {
                const User = member.user.username
                
                arguments.shift()
                const Reason = arguments.join(' ')
                
                const Moderator = message.author.username
                const Server = member.guild.name
                const ban = new banList( {
                    Discord_id,
                    User,
                    Reason,
                    Moderator,
                    Server,
                })
                try{
                    await ban.save()
                }catch (err) {
                    console.log(err)
                } finally {
                    con.connection.close()
                }
                const embed = new Discord.MessageEmbed()
                .setTitle(`${User} Banned`)
                .setAuthor(Moderator)
                .setFooter(`ID:${Discord_id}\t Cross Bot 2.0`)
                .setColor('#FFOOOO')
                .addFields(
                    {
                        name: "User",
                        value: `${User}`,
                        inline: true
                    },
                    {
                        name: "Reason",
                        value: Reason,
                        inline: true
                    },
                    {
                        name: "Moderator",
                        value: Moderator,
                        inline: true
                    }   
                )
                message.channel.send(embed)
            } else {
                message.channel.send(`Not a valid ID or mention`)
            }  
        }
    }
}