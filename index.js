const path = require("path");
const { MongoClient } = require("mongodb");
const { MongoDBProvider } = require("commando-provider-mongo");
const Commando = require("discord.js-commando");
const Discord = require("discord.js")
const config = require("./config.json");
const mongo = require("./util/mongoose");
const banList = require("./schemas/banList");
const roleList = require("./schemas/roleList");
//==========//End Imports//==========//

const client = new Commando.CommandoClient({
    owner: "109314596484939776",
    commandPrefix: config.prefix,
});

client.setProvider(
    MongoClient.connect(config.mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then((client) => {
            return new MongoDBProvider(client, "discordbot");
        })
        .catch((err) => {
            console.error(err);
        })
);

client.on("ready", async () => {
    console.log("The client is ready");
    await mongo();
    client.registry
        .registerGroups([
            ["misc", "misc commands"],
            ["moderation", "moderation commands"],
            ["setup", "setup commands"],
        ])
        .registerDefaults()
        .registerCommandsIn(path.join(__dirname, "commands"));

    let guild_ids = client.guilds.cache.map((guild) => guild.id);
    let roles = {};
    for (let guild_id of guild_ids) {
        roles[guild_id] = await roleList.find({ Guild_id: guild_id });
    }
    client.roleCache = roles;
});

client.on("guildMemberAdd", async (member) => {
    console.log("searching for bans");
    const bans = await banList.find({ Discord_id: member.id });
    if (!bans) {
        return;
    } else {
        console.log("creating ban message");
        for (const ban of bans) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`Warning ${ban.User} was previously banned `)
                .setAuthor(ban.Moderator)
                .setFooter(`ID:${ban.Discord_id}\t Cross Bot 2.0`)
                .setColor("#FFOOOO")
                .addFields(
                    {
                        name: "User",
                        value: `${ban.User}`,
                        inline: true,
                    },
                    {
                        name: "Reason",
                        value: ban.Reason,
                        inline: true,
                    },
                    {
                        name: "Moderator",
                        value: ban.Moderator,
                        inline: true,
                    }
                );
            client.channels.cache.get("871520230881509416").send(embed);
        }
    }
});

client.login(config.token);
