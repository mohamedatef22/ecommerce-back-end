const mongoose = require("mongoose");
const dbURI = process.env.MONGODB_URI || "mongodb://localhost/ecommerece";

module.exports = function () {
  mongoose
    .connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("connected to db Succefully");
    })
    .catch((err) => {
      console.log("connected to db failed", err);
    });
};
