const channelList = require('../schemas/channelList')

async function update_channel(client){
    guild_ids = client.guilds.cache.map((guild) => guild.id)
    client.channelCache = Object.fromEntries(
        await Promise.all(
            client.guilds.cache.map(
                async (guild) => [guild.id, await channelList.find(
                    {Guild_id: guild.id}
                )]
            )
        )
    )
}

module.exports = update_channel;