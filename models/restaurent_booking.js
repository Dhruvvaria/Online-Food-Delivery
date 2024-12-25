const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema ({
    name : String,
    mobile : Number,
    time : String,
    adult : Number, 
    child : Number
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking ;