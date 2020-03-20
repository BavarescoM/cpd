const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");

const Gauging = new Schema({
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
  }
});
Gauging.plugin(mongoosePaginate);
module.exports = mongoose.model("gaugings", Gauging);
