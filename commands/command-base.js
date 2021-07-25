const { prefix: globalPrefix } = require('../config.json')
const mongo = require('../util/mongoose')
const commandPrefix = require('../schemas/command-prefix')
const guildPrefixes = {}

const validatePerms = permissions => {
    // List of all valid discord permissions
    const validPermissions = [
        'CREATE_INSTANT_INVITE',
        'KICK_MEMBERS',
        'BAN_MEMBERS',
        'ADMINISTRATOR',
        'MANAGE_CHANNELS',
        'MANAGE_GUILD',
        'ADD_REACTIONS',
        'VIEW_AUDIT_LOG',
        'PRIORITY_SPEAKER',
        'STREAM',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'READ_MESSAGE_HISTORY',
        'MENTION_EVERYONE',
        'USE_EXTERNAL_EMOJIS',
        'VIEW_GUILD_INSIGHTS',
        'CONNECT',
        'SPEAK',
        'MUTE_MEMBERS',
        'DEAFEN_MEMBERS',
        'MOVE_MEMBERS',
        'USE_VAD',
        'CHANGE_NICKNAME',
        'MANAGE_NICKNAMES',
        'MANAGE_ROLES',
        'MANAGE_WEBHOOKS',
        'MANAGE_EMOJIS',
    ]

    // Check if the permission passed in is valid
    for (const permission of permissions) {
        if(!validPermissions.includes(permission)) {
            // throw error for unknown permission
            throw new Error(`Unknown Permission mode "${permission}"`)
        }
    }
}

const allCommands = {}

module.exports = (commandOptions) => {
    
    // Object destructure command options with defaults.
    let {
        commands,
        permissions = [],
    } = commandOptions;

    // Convert To Array
    if (typeof commands === 'string') {
        commands = [commands]
    }

    console.log(`Registering command "${commands[0]}"`)

    // Make sure that the permissions are valid (if any)
    if (permissions.length) {
        if(typeof permissions ==='string') {
            permissions = [permissions]
        }
        validatePerms(permissions)
    }
    for (const command of commands) {
        allCommands[command] = {
            ...commandOptions,
            commands,
            permissions
        }
    }
}

module.exports.listen = (client) => {
    // Listen for messages
    client.on('message', message => {
        const { member, content, guild } = message

        const prefix = guildPrefixes[guild.id] || globalPrefix
        // Split on any number of spaces
        const arguments = content.split(/[ ]+/)

        // Remove the command at first index
        const name = arguments.shift().toLowerCase()
        
        if (name.startsWith(prefix)) {
            const command = allCommands[name.replace(prefix, '')]
            
            // Check that command exists
            if(!command) {
                return
            }

            const {
                permissions,
                permissionError = "You do not have permission to run this command.",
                requiredRoles = [],
                minArgs = 0,
                maxArgs = null,
                expectedArgs,
                callback
            } = command



            // Check for permissions
            for (const permission of permissions) {

                if (!member.hasPermission(permission)) {
                    message.reply(permissionError)

                    // Fail Perm Check
                    return
                }
            }

            // Check for required roles
            for (const requiredRole of requiredRoles) {
                const role = guild.roles.cache.find(role => role.name === requiredRole)

                // Check if user has the role and if the role exists
                if (!role || !member.roles.cache.has(role.id)) {
                    message.reply(`You must have the "${requiredRole}" role to use this command.`)
                    return
                }

            }

            // Ensure we have the correct number of arguments
            if (arguments.length < minArgs ||
                (maxArgs !== null && arguments.length > maxArgs)) {
                message.reply(`Incorrect syntax! Use ${prefix}${alias} ${expectedArgs}`)
                return
            }

            // Handle custom command code
            callback(message, arguments, arguments.join(' '))
        }
    })
}

module.exports.loadPrefixes =  async client => {
    await mongo().then(async mongoose => {
        try { 
            for(const guild of client.guilds.cache) {
                const result = await commandPrefix.findById({_id: guild[1].id})
                guildPrefixes[guild[1].id] = result.prefix
            }
            console.log(guildPrefixes)
        } finally {
            mongoose.connection.close()
        }
    })
}

module.exports.updateCache = (guildID, newPrefix) => {
    guildPrefixes[guildID] = newPrefix
}