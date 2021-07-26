const mongoose = require("mongoose");
const banList = mongoose.Schema({
    Discord_id: {
        type: String,
        required: true,
    },
    User: {
        type: String,
        required: false,
        default: "Not Available"
    },
    Reason: {
        type: String,
        required: true,
        default: "Backlog Ban, Please contact the server owner for information on the ban"
    },
    Moderator: {
        type: String,
        required: true,
        default: "Cross Bot BackLog"
    },
    Server: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        required: false,
        default: function() { 
            const d = new Date
            return d.toDateString()
        }
    }
});

module.exports = mongoose.model("ban-list", banList);