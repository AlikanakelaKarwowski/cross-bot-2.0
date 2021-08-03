const mongoose = require('mongoose')
const channelList = mongoose.Schema({
    Guild_id: {
        type: String,
        required: true,
    },
    Channel: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('channel-list', channelList)