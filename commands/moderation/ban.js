const mongo = require('../../util/mongoose')
const Commando = require('discord.js-commando')
const banList = require('../../schemas/banList')
const Discord = require('discord.js')
const roleList = require('../../schemas/roleList')
module.exports = class BanCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: "ban",
            group: "moderation",
            memberName: "ban",
            description: "ban and record a user",
            argsType: "multiple",
            guildOnly: true,
            examples: ["ban <@User or User ID> <Reason>"],
        });
    }

    hasPermission(message) {
        // TODO: Create a command to set guild roles for banning people.
        const roles = await roleList.find({Guild_id: message.guild.id})
        return (message.member.roles.cache.some(role => roles.includes(role)))
    }

    async run(message, args) {
        var Discord_id = args[0];
        if (Discord_id.startsWith("<@")) {
            Discord_id = Discord_id.match(/\d{17,18}/)[0];
        } else if (isNaN(Discord_id) || !Discord_id) {
            message.channel.send("You probably typed something in wrong.");
            return;
        }
       
        const member = await message.guild.members.fetch(Discord_id);

        if (member) {
            const User = member.user.username || "N/A";
            args.shift();
            const Reason = args.join(" ");
            const Moderator = message.author.username;
            const Server = member.guild.name || "N/A";
            const ban = new banList({
                Discord_id,
                User,
                Reason,
                Moderator,
                Server,
            });
            try {
                await ban.save();
            } catch (err) {
                console.log(err);
            }

            const embed = new Discord.MessageEmbed()
                .setTitle(`${User} Banned`)
                .setAuthor(Moderator)
                .setFooter(`ID:${Discord_id}\t Cross Bot 2.0`)
                .setColor("#FFOOOO")
                .addFields(
                    {
                        name: "User",
                        value: `${User}`,
                        inline: true,
                    },
                    {
                        name: "Reason",
                        value: Reason,
                        inline: true,
                    },
                    {
                        name: "Moderator",
                        value: Moderator,
                        inline: true,
                    }
                );
            message.channel.send(embed);
        } else {
            message.channel.send(`An Error has occured or discord is just being dumb`);
        }
    }
};
