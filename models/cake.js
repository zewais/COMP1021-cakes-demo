const mongoose = require("mongoose");
const { type } = require("os");
const Schema = mongoose.Schema;

const cakeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  price: {
    "8 inch": Number,
    "10 inch": Number,
    "12 inch": Number,
  },
  image: {
    type: String,
    required: true,
  },
});

const Cake = mongoose.model("Cake", cakeSchema);
module.exports = Cake;
// This code defines a Mongoose schema and model for a cake. The schema defines the structure of the cake object,
// and the model is used to interact with the database. The Cake model is exported so it can be used in other parts of the application.
