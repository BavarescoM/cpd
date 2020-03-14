const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Protocol = new Schema({
  user: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});
module.exports = mongoose.model("protocols", Protocol);
