const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ValidationContract = require("../Helpers/validators");
require("../Models/Balance");
const Balance = mongoose.model("balances");
//const { zonedTimeToUtc } = require("date-fns-tz");
const pt = require("date-fns/locale/pt");

const {
  parseISO,
  format,
  formatRelative,
  formatDistance
} = require("date-fns");

router.get("/", (req, res) => {

  req.flash('message', "bombou  ");

  var utc = new Date().toJSON().slice(0, 10);
  console.log(utc);
  Balance.find({ date: utc }).then(status => {
    var statusBalA = false;
    var statusBalM = false;
    /*
     if (status[0].period == "tarde" || status[1].period == "tarde") {
       statusBalA = true;
     }
     if (status[0].period == "manha" || status[1].period == "manha") {
       statusBalM = true;
     }*/
    res.render("general/index", {
      statusBalA,
      statusBalM
    });
  });
});

router.get("/bal", (req, res) => {
  //Balance.find({})
  res.render("general/bal/index");
});

router.post("/bal/create", (req, res) => {
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
  contract.isUserRequired(req.body.users, "Operador é requisitado");
  contract.isUserRequired(req.body.period, "Periodo é requisitado");
  contract.isBalEmpty(bal, "Deve preencher pelo menos um campo de balança");
  contract.isPeriodValid(req.body.date, "Já foi feita aferição neste Turno");
  if (!contract.isValid()) {
    var error = contract.errors();
    console.log(error);

    res.render("general/bal/index", { error });
    return;
  } else {
    new Balance(bal)
      .save()
      .then(() => {
        res.render("general/bal/index", { message: 'Aferição Cadastrada com Sucesso' });
      })
      .catch(error => {
      });
  }
});

router.get("/bal/report", (req, res) => {
  Balance.find().then(bal => {
    /*
    const firstDate = parseISO(bal.date);
    // const znDate = zonedTimeToUtc(firstDate, "America/Sao_Paulo");
    const formattedDate = format(firstDate, "dd'/'MM'/'yyyy'");
    */
    res.render("general/bal/report", { bal });
  });
});

router.get("/bal/delete/:id", (req, res) => {
  const id = req.params.id;
  Balance.findOneAndRemove({ _id: id })
    .then(() => {
      console.log("Deletado com Sucesso");
      res.redirect("/bal/report");
    })
    .catch(error => {
      alert("erro ao deletar" + error);
    });
});

router.get("/bal/edit/:id", (req, res) => {
  const id = req.params.id;
  Balance.findById({ _id: id }).then(balance => {
    res.render("general/bal/edit", { balance });
  });
});

router.post("/bal/edit", (req, res) => {
  Balance.findOne({ _id: req.body.id })
    .then(balance => {
      (balance.date = req.body.date),
        (balance.user = req.body.users),
        (balance.period = req.body.period),
        (balance.bal10 = req.body.bal10),
        (balance.bal11 = req.body.bal11),
        (balance.bal12 = req.body.bal12),
        (balance.bal13 = req.body.bal13),
        (balance.bal14 = req.body.bal14),
        (balance.bal15 = req.body.bal15),
        (balance.bal16 = req.body.bal16),
        (balance.bal17 = req.body.bal17),
        (balance.bal18 = req.body.bal18),
        (balance.bal19 = req.body.bal19),
        (balance.bal20 = req.body.bal20);
      balance
        .save()
        .then(() => {
          console.log(balance);
          req.flash("success_msg", "Aferição editada com Sucesso");
          res.redirect("/bal/report");
        })
        .catch(eror => {
          req.flash("error_msg", "Houve um erro ao salvar a Aferição");
          res.redirect("/bal/report");
        });
    })
    .catch(error => {
      req.flash("error_msg", "Houve um erro ao editar a Aferição");
      res.redirect("/bal/report");
    });
});

module.exports = router;
