const mongoose = require('mongoose')

const commandPrefix = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    prefix: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model('guild-prefix', commandPrefix)