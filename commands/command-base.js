const { prefix } = require('../config.json')

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

module.exports = (client, commandOptions) => {
    
    // Object destructure command options with defaults.
    let {
        commands,
        expectedArgs = '',
        permissionError = 'You do not have permission to run this command.',
        minArgs = 0,
        maxArgs = null,
        permissions = [],
        requiredRoles = [],
        callback
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

    // Check for command message
    client.on('message', message => {
        const {member, content, guild } = message
        
        // Check if any commands have been triggered
        for (const alias of commands) {

            // Check if a command has been run
            if(content.toLowerCase().startsWith(`${prefix}${alias.toLowerCase()}`)) {
            
                // Check for permissions
                for (const permission of permissions){
                    
                    if(!member.hasPermission(permission)) {
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

                // Split on any number of spaces
                const arguments = content.split(/[ ]+/)

                // Remove the command at first index
                arguments.shift()

                // Ensure we have the correct number of arguments
                if (arguments.length < minArgs || 
                    (maxArgs !==null && arguments.length > maxArgs)) {
                        message.reply(`Incorrect syntax! Use ${prefix}${alias} ${expectedArgs}`)
                        return
                }

                // Handle custom command code
                callback(message, arguments, arguments.join(' '))


                return
            }
        }
    })
}