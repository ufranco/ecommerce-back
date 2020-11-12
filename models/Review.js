const { Schema, model } = require("mongoose");

const ReviewSchema = Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productRelated: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    createdAt: Date,
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: [
        true, 
        "Please give a rating."
      ],
    },
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: [
        true, 
        "Please leave a brief description of the product"
      ],
      minlength: [
        30, 
        "Review description has have at least 30 characters"
      ],
    },  
  },
  {
    timestamps: { 
      createdAt: 'created_at', 
      updatedAt: 'updated_at' 
    } 
  }
);

module.exports = model("Review", ReviewSchema);
