const mongoose = require("mongoose");
require("../Models/Balance");
const Balance = mongoose.model("balances");
var fs = require("fs");

exports.excel = async (regexp) => {
    

   const bal = await Balance.find({ date: regexp });
    var header =
      "Data" +
      "\t" +
      " Usuario" +
      "\t" +
      "Bal10" +
      "\t" +
      "Bal11" +
      "\t" +
      "Bal12" +
      "\t" +
      "Bal13" +
      "\t" +
      "Bal14" +
      "\t" +
      "Bal15" +
      "\t" +
      "Bal16" +
      "\t" +
      "Bal17" +
      "\t" +
      "Bal18" +
      "\t" +
      "Bal19" +
      "\t" +
      "Bal20" +
      "\n";
  return  header;
    /*
    for (var index = 0; index < bal.length; index++) {
      function rep(value) {
        if (value == "on") {
          value = "ok";
          return value;
        } else {
          value = "";
          return value;
        }
      }
      var row1 =
        bal[index].date +
        "\t" +
        bal[index].user +
        "\t" +
        bal[index].period +
        "\t" +
        rep(bal[index].bal10) +
        "\t" +
        rep(bal[index].bal11) +
        "\t" +
        rep(bal[index].bal12) +
        "\t" +
        rep(bal[index].bal13) +
        "\t" +
        rep(bal[index].bal14) +
        "\t" +
        rep(bal[index].bal15) +
        "\t" +
        rep(bal[index].bal16) +
        "\t" +
        rep(bal[index].bal17) +
        "\t" +
        rep(bal[index].bal18) +
        "\t" +
        rep(bal[index].bal19) +
        "\t" +
        rep(bal[index].bal20) +
        "\n";
      writeStream.write(row1);
*/

    
  };
