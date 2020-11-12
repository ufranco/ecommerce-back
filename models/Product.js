const { Schema, model } = require("mongoose");

const ProductSchema = new Schema(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [
        true, 
        "Please specify product's name"
      ],
      unique: false,
      trim: true,
      maxlength: [
        50, 
        "Product's name cannot be larger than 30 characters"
      ],
    },
    stock: {
      type: Number,
      required: [
        true, 
        "Please specify the availability of the product"
      ],
      min: 0,
    },
    price: {
      type: Number,
      currency: {
        type: String,
        enum: [
          "USD", 
          "AUD", 
          "EUR", 
          "ARS"
        ],
        default: "USD",
      },
      required: [
        true, 
        "Products must have a price"
      ],
      min: 0,
    },
  },
  {
    timestamps: { 
      createdAt: 'created_at', 
      updatedAt: 'updated_at' 
    } 
  }
);

module.exports = model("Product", ProductSchema);
