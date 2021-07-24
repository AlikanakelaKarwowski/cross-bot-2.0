const mongo = require('./mongoose')
const command = require('./command')
const welcomeSchema = require('../schemas/server')

module.exports = (client) => {
    const cache = {}
    command(client, 'setwelcome', async message => {
        const { member, channel, content, guild } = message
        
        if (!member.hasPermission('ADMINISTRATOR')){
            channel.send('You do not have permission to run this command.')
            return
        }
        let text = content
        
        const split = text.split(' ')
        if(split.length < 2) {
            channel.send('Please provide a welcome message')
            return
        }

        split.shift()
        text = split.join(' ')

        cache[guild.id] = [channel.id, text]
        await mongo().then(async mongoose => {
            try{
                await welcomeSchema.findByIdAndUpdate({_id: guild.id}, 
                    {
                        _id: guild.id,
                        channel_id: channel.id,
                        text
                    }, {
                        upsert: true
                    })
            } finally {
                mongoose.connection.close()
            }
        })
    })
    const onJoin = async member => {
        const {guild} = member
        let data = cache[guild.id]

        if(!data) {
            console.log('FETCHING FROM MONGO')
            await mongo().then( async mongoose => {
                try {
                    const result = await welcomeSchema.findById({_id: guild.id})

                    cache[guild.id] = data =[result.channel_id, result.text]
                } finally {
                    mongoose.connection.close()
                }
                
            })
        }
        
        const channel_id = data[0]
        const text = data[1]
        const channel = guild.channels.cache.get(channel_id)
        channel.send(text.replace(/<@>/g, `<@${member.id}>`))
    }
    command(client, 'simjoin', message => {
        onJoin(message.member)
    })
    client.on('guildMemberAdd', member => {
        onJoin(member)
    })
}