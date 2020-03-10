"use strict";

const mongoose = require("mongoose");
require("../Models/Balance");
const Balance = mongoose.model("balances");
let errors = [];

function ValidationContract() {
  errors = [];
}

ValidationContract.prototype.isUserRequired = (value, message) => {
  if (value == 0) errors.push({ message: message });
};

ValidationContract.prototype.isPeriodValid = (value, message) => {
  Balance.find({ date: value }).then(ret => {
    console.log(ret[0].period);
    if (
      ret[0].period == "manha" ||
      "tarde" ||
      ret[1].period == "manha" || "tarde"
    ) {
      console.log("passou nos erros");

      errors.push({ message: message });
    }
  });
};
ValidationContract.prototype.isBalEmpty = (value, message) => {
  let count = 0;
  if (value.bal10 == undefined) {
    count += 1;
  }

  if (value.bal11 == undefined) {
    count += 1;
  }

  if (value.bal12 == undefined) {
    count += 1;
  }
  if (value.bal13 == undefined) {
    count += 1;
  }
  if (value.bal14 == undefined) {
    count += 1;
  }
  if (value.bal15 == undefined) {
    count += 1;
  }
  if (value.bal16 == undefined) {
    count += 1;
  }
  if (value.bal17 == undefined) {
    count += 1;
  }
  if (value.bal18 == undefined) {
    count += 1;
  }
  if (value.bal19 == undefined) {
    count += 1;
  }
  if (value.bal20 == undefined) {
    count += 1;
  }
  if (count == 11) {
    errors.push({ message: message });
  }
};

ValidationContract.prototype.errors = () => {
  return errors;
};

ValidationContract.prototype.clear = () => {
  errors = [];
};

ValidationContract.prototype.isValid = () => {
  return errors.length == 0;
};

module.exports = ValidationContract;
