module.exports = {
    commands: "cc",
    minArgs: 0,
    maxArgs: 0,
    expectedArgs: "None",
    requiredRoles: [],
    permissions: ['ADMINISTRATOR'],
    callback: async (message) => {
        const messages = await message.channel.messages.fetch()
        message.channel.bulkDelete(messages)
    }
};