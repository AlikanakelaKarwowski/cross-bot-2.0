const Commando = require('discord.js-commando')
const channelList = require('../../schemas/channelList')

module.exports = class setChannelCommand extends Commando.Command {
    constructor(client){
        super(client, {
            name: 'setchannel',
            group: 'setup',
            memberName: 'setChannel'
        })
    }
}