const mongoose = require('mongoose')
const roleList = mongoose.Schema({
    Guild_id: {
        type: String,
        required: true,
    },
    Roles: {
        type: [String],
        required: false
    }
})