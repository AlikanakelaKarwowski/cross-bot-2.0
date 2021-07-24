module.exports = (client, triggerText, replyText) => {
    client.on('message', message => {
        if(message.channel.type === 'dm' && message.content.toLowerCase() == triggerText.toLowerCase()) {
            message.author.send(replyText)
        
        }
    })
}

// client.users.fetch('').then((user) => {
//     user.send("hello world")
// })