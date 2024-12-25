const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true,
      },
      title: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  totalQuantity: Number,
  totalPrice: Number,
  createdAt: { type: Date, default: Date.now },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
