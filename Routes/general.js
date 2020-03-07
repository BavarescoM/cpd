const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ValidationContract = require("../Helpers/validators");
require("../Models/Balance");
const Balance = mongoose.model("balances");

router.get("/", (req, res) => {
  res.render("general/index");
});

router.get("/bal", (req, res) => {
  req.flash("test", "it worked");

  req.flash("success", "Logged in");
  req.flash("success_msg", "bombou");
  res.render("general/bal/index");
});

router.post("/bal/create", (req, res) => {
  console.log(req.body.date);

  const bal = {
    date: req.body.date,
    user: req.body.users,
    period: req.body.period,
    bal10: req.body.bal10,
    bal11: req.body.bal11,
    bal12: req.body.bal12,
    bal13: req.body.bal13,
    bal14: req.body.bal14,
    bal15: req.body.bal15,
    bal16: req.body.bal16,
    bal17: req.body.bal17,
    bal18: req.body.bal18,
    bal19: req.body.bal19,
    bal20: req.body.bal20
  };

  let contract = new ValidationContract();
  contract.isUserRequired(req.body.users, "Usuario é requisitado");
  contract.isBalEmpty(bal, "Deve preencher pelo menos um campo de balança");
  if (!contract.isValid()) {
    console.log(contract.errors());
    req.flash("error_msg", "erro");
    res.redirect("/bal");
    return;
  } else {
    new Balance(bal)
      .save()
      .then(() => {
        res.redirect("/bal");
        console.log("Dados salvos");
      })
      .catch(error => {
        console.log("Erro ao salvar", +error);
      });
  }
});

router.get("/bal/report", (req, res) => {
  Balance.find().then(bal => {
    res.render("general/bal/report", { bal });
  });
});

module.exports = router;
