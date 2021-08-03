const Commando = require('discord.js-commando')
const channelList = require('../../schemas/channelList')

module.exports = class setChannelCommand extends Commando.Command {
    constructor(client){
        super(client, {
            name: 'setchannel',
            group: 'setup',
            memberName: 'setChannel',
            description: 'Set Channel for notifications. Uses channel ID.',
            argsType: 'multiple',
            guildOnly: true,
            examples: ["setchannel <Channel ID>"]
        })
    }

    hasPermission(message) {
        return message.member.id === message.guild.ownerID
    }

    async run(message, args){
        const Channel = args[1]
        try{
            await channnelList.updateOne(
                {Guild_id: message.guild.id},
                {Channel},
                {upsert: true})
        } catch (err) {
            console.log(err)
        }
        updateChannels(this.client)
        message.channel.cache.get(Channel).send(`I will send you notifications in this channel.`)
    }
}