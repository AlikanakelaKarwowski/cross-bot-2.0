const roleList = require('../schemas/roleList')

async function update_roles(client) {
    guild_ids = client.guilds.cache.map((guild) => guild.id);
    client.roleCache = Object.fromEntries(
        await Promise.all(
            client.guilds.cache.map(
                async (guild) => [guild.id, await roleList.find({Guild_id: guild.id})]
                )
            )
    );
}

module.exports = update_roles;