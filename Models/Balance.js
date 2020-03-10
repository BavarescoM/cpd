const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Balance = new Schema({
  date: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  period: {
    type: String
  },
  bal10: {
    type: String
  },
  bal11: {
    type: String
  },
  bal12: {
    type: String
  },
  bal13: {
    type: String
  },
  bal14: {
    type: String
  },
  bal15: {
    type: String
  },
  bal16: {
    type: String
  },
  bal17: {
    type: String
  },
  bal18: {
    type: String
  },
  bal19: {
    type: String
  },
  bal20: {
    type: String
  }
});
module.exports = mongoose.model("balances", Balance);
