const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hotelSchema = new Schema({
    name:{
        type:String, 
        require:true,
    },
    address:String,
    image:{
        type: String,
        default:
          "https://plus.unsplash.com/premium_photo-1673590981774-d9f534e0c617?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGlzaHxlbnwwfHwwfHx8MA%3D%3D",
        set: (v) =>
          v === ""
            ? "https://plus.unsplash.com/premium_photo-1673590981774-d9f534e0c617?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGlzaHxlbnwwfHwwfHx8MA%3D%3D"
            : v,
      },
    time:String,
    price:Number,
})

const Hotels = mongoose.model("Hotels", hotelSchema);
module.exports  = Hotels;

