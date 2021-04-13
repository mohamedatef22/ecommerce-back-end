const mongoose = require("mongoose");
const validator = require("validator").default;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return (
            validator.isAlpha(v, "ar-AE", { ignore: " " }) ||
            validator.isAlpha(v, "en-US", { ignore: " " })
          );
        },
        message: "invalid name",
      },
      minLength: 3,
      maxLength: 255,
    },
    description: {
      type: String,
      trim: true,
    },
    modelNumber: {
      type: String,
      trim: true,
    },
    numInStock: {
      type: Number,
      min: 0,
      max: 99999,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      max: 999999,
    },
    flashSale: {
      // FIXME: make table for flash sale
      type: new mongoose.Schema(
        {
          price: {
            type: Number,
            required: true,
            min: 0,
          },
          end: {
            type: Date,
          },
        },
        { timestamps: true, str }
      ),
    },
    shop: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          trim: true,
        },
        info: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: "Shop",
        },
      }),
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  const prod = this;
  if (prod.flashSale) {
    if (prod.price <= prod.flashSale.price)
      throw new Error("flash sale price is incorrect");
  }
  next();
});

const Product = new mongoose.model("Product", productSchema);

module.exports = Product;
