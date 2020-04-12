const mongoose = require('mongoose');

var TripSchema = new mongoose.Schema({
    tripName: {
        type : String,
        required: "Required"
    },
    image : {
        type : String,
        required: "Required"
    },
    date : {
        type : Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('trip',TripSchema);