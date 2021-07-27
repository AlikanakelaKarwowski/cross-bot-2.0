const path = require('path')
const fs = require('fs')
const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const mongo = require('./util/mongoose')
const banList = require('./schemas/banList')
//==========//End Imports//==========//

client.on('ready', async () => {
    console.log('The client is ready')
    
    const baseFile = 'command-base.js'
    const commandBase = require(`./commands/${baseFile}`)

    const readCommands = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for (const file of files){
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if (stat.isDirectory()) {
                readCommands(path.join(dir, file))
            } else if (file !== baseFile) {
                const option = require(path.join(__dirname, dir, file))
                commandBase(option)
            }
        }
    }

    readCommands('commands')
    commandBase.listen(client)
    commandBase.loadPrefixes(client)
    
    client.on("guildMemberAdd", async (member) => {
        console.log("searching for bans");
        
        const con = await mongo();
        try {
            const bans = await banList.find({Discord_id : member.id});
            if (!bans) {
                return;
            } else {
                console.log("creating ban message");
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Warning ${bans[0].User} was previously banned `)
                    .setAuthor(bans[0].Moderator)
                    .setFooter(`ID:${bans[0].Discord_id}\t Cross Bot 2.0`)
                    .setColor("#FFOOOO")
                    .addFields(
                        {
                            name: "User",
                            value: `${bans[0].User}`,
                            inline: true,
                        },
                        {
                            name: "Reason",
                            value: bans[0].Reason,
                            inline: true,
                        },
                        {
                            name: "Moderator",
                            value: bans[0].Moderator,
                            inline: true,
                        }
                    );
                client.channels.cache.get("868293138421284968").send(embed);
            }
        } catch (err) {
            console.log(err);
        } finally {
            con.connection.close();
        }
        
    });

    client.emit("guildMemeberAdd", client.user);
})

client.login(config.token)
