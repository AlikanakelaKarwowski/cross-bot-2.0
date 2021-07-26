const mongo = require('../../util/mongoose')
const banlist = require('../../schemas/banList')
const banList = require('../../schemas/banList')
module.exports = {
    commands:'ban',
    minArgs: 2,
    expectedArgs: "<Targer users ID> <reason>",
    requiredRoles: [],
    callback: async (message, arguments) => {
        const target = message.mentions.users.first()
        
        if(target) {
            try{
                const mdb = await mongo()
                console.log(mdb)
            }catch (err) {
                console.log(err)
            }finally {
                
            }
            message.channel.send(`User <@${target.id}> was banned`)


        } else {
            const Discord_id = arguments[0]
            const member= await message.guild.members.fetch()
            
            if(member.get(Discord_id)) {
                
                const mdb = await mongo()
                const User = member.get(Discord_id).user.username
                
                arguments.shift()
                const Reason = arguments.join(' ')
                
                const Moderator = message.author.username
                const Server = member.get(Discord_id).guild.name
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
                }finally {
                    
                }
                
                
                message.channel.send(`User <@${Discord_id}> was banned`)
            } else {
                message.channel.send(`Not a valid ID or mention`)
            }  
        }
    }
}