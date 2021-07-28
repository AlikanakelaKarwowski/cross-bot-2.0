// const mongo = require('../../util/mongoose')
// const commandPrefix = require('../../schemas/command-prefix')
// const commandBase = require('../command-base')
// module.exports = {
//     commands: 'setprefix',
//     minArgs: 1,
//     maxArgs: 1,
//     expectedArgs: "<This bot's new command prefix>",
//     permissionError: "You must be an admin to run this command.",
//     permissions: 'ADMINISTRATOR',
//     callback: async (message, arguments) => {
//         await mongo().then(async mongoose => {
//             try {
//                 const _id = message.guild.id
//                 const prefix = arguments[0]

//                 await commandPrefix.findByIdAndUpdate({_id}, {_id, prefix}, {upsert:true})

//                 message.reply(`The prefix for this bot is now ${prefix}`)
//                 commandBase.updateCache(_id, prefix)
//             } finally {
//                 mongoose.connection.close()
//             }
//         })
//     }
// }