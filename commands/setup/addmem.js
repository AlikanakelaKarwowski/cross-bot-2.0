const Commando = require('discord.js-commando')

module.exports = class addMemberCommand extends Commando.Command {
    constructor(client){
        super(client, {
            name: 'addmem',
            group: 'setup',
            memberName: 'addmem',
            description: 'Test notification of emit(\'guildMemberAdd\'',
            argsType: 'single',
            argsCount: 0,
            guildOnly: true
        })
    }

    async run(message) {
        this.client.emit('guildMemberAdd', this.client.user)
    }
}