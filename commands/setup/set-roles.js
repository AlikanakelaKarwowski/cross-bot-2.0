const Commando = require('discord.js-commando')
const roleList = require('../../schemas/roleList')
const Discord = require('discord.js')

module.exports = class setRoleCommand extends Commando.Command{
    constructor(client){
        super(client, {
            name: 'setrole',
            group: "setup",
            memberName: "setrole",
            description: "Set the role for users that can use the ban command. Use this command for each role you would like to add to allowed roles.",
            argsType: "multiple",
            guildOnly: true,
            examples: ["setrole <RoleName>"]
        })
    }

    hasPermission(message) {
        return message.guild.ownerID === message.member.id
    }
    async run(message, args){
        console.log("running set prefix")
        const role = args.join(" ")
        try{
            await roleList.updateOne(
                { Guild_id: message.guild.id },
                { $addToSet: { Roles: role.toLowerCase() } },
                { upsert: true }
                );
        } catch(err) {
            console.log(err)
        }
        message.channel.send(`The role \`${role}\` was added to the list that can use the ban command.`)
        
    }
}