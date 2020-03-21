const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate')

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
}, { timestamps: true }
);
Protocol.plugin(mongoosePaginate)
module.exports = mongoose.model("protocols", Protocol);
