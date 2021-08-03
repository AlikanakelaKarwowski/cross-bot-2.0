const Commando = require('discord.js-commando')
const roleList = require('../../schemas/roleList')
const update_roles = require('../../util/update_roles')


module.exports = class setRoleCommand extends Commando.Command{
    constructor(client){
        super(client, {
            name: 'setrole',
            group: "setup",
            memberName: "setrole",
            description: "Set the role for users that can use the ban command. Use the name of the role, capitalization matters. For additional roles run command again.",
            argsType: "multiple",
            guildOnly: true,
            examples: ["setrole <RoleName>"]
        })
    }

    hasPermission(message) {
        return message.guild.ownerID === message.member.id
    }
    async run(message, args){
        const role = args.join(" ")
        try{
            await roleList.updateOne(
                { Guild_id: message.guild.id },
                { $addToSet: { Roles: role} },
                { upsert: true }
                );
        } catch(err) {
            console.log(err)
        }
        update_roles(this.client)
        message.channel.send(`The role \`${role}\` was added to the list that can use the ban command.`)
        
    }
}