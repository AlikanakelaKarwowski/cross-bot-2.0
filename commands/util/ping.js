module.exports = {
    commands: 'ping',
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments, text) => {
        const ping = Math.floor((message.createdTimestamp - Math.floor(Date.now()))/10)
        message.channel.send(`Pong ${ping}ms`)
    }
}