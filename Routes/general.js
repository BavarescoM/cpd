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
  var utc = new Date().toJSON().slice(0, 10);
  console.log(utc);
    const firstDate = parseISO(utc);
    // const znDate = zonedTimeToUtc(firstDate, "America/Sao_Paulo");
    const formattedDate = format(firstDate, "dd'/'MM'/'yyyy'");
   
  Balance.find({ date: utc }).then(status => {
    var statusBalA = false;
    var statusBalM = false;
    console.log(status[0].period + status[1].period)
     if (status[0].period == "Tarde" || status[1].period == "Tarde") {
       statusBalA = true;
     }
     if (status[0].period == "Manhã" || status[1].period == "Manhã") {
       statusBalM = true;
     }
    res.render("general/index", {
      statusBalA,
      statusBalM,
      formattedDate
    });
  });
});

router.get("/bal", (req, res) => {
  //Balance.find({})
  res.render("general/bal/index");
});

router.post("/bal/create", async (req, res) => {
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

  let bo;
  await Balance.findOne({ date: bal.date, period:bal.period }).then(ret => {
    if (ret != null){
      bo = 0;
    }
  });
  let contract = new ValidationContract();
  contract.isUserRequired(bal.user, "Operador é requisitado");
  contract.isUserRequired(bal.period, "Periodo é requisitado");
  contract.isUserRequired(bo, "Já foi feita aferição neste Turno");
  contract.isBalEmpty(bal, "Deve preencher pelo menos um campo de balança");
  

  if (!contract.isValid()) {
    var error = contract.errors();
    res.render("general/bal/index", { error });
    return;
  } else {
    new Balance(bal)
      .save()
      .then(() => {
        res.render("general/bal/index", { message: 'Aferição Cadastrada com Sucesso' });
        
      })
      .catch(erro => {
        console.log('erro ao salvar');
      });
  }
});

router.get("/bal/report", (req, res) => {
  Balance.find().sort({date: -1}).then(bal => {

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

router.get("/bal/edit/:id?", (req, res) => {
  var error = req.params.erro;
  console.log(error, 'eror :id');
  const id = req.params.id;
  Balance.findById({ _id: id }).then(balance => {
    res.render("general/bal/edit", { balance, error });
  });
});

router.post("/bal/edit",  async(req, res) => {
    /*
    let bo;
  await Balance.findOne({ date: req.body.date, period:req.body.period }).
  where(id : req.body.id).then(ret => {
    if (ret != null){
      console.log(ret);
      bo = 0;
    }
  });*/
  let contract = new ValidationContract();

  //contract.isUserRequired(bo, "Já foi feita aferição neste Turno");
  contract.isBalEmpty(req.body, "Deve preencher pelo menos um campo de balança");
  
  if (!contract.isValid()) {
    var error = contract.errors();
    var x = JSON.stringify(error);
    res.redirect(`/bal/edit/${req.body.id}?erro=${x}`);
    return;
  } else {
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
          res.redirect("/bal/report");
          console.log('Editado com Sucesso');
        })
        .catch(eror => {
          res.redirect("/bal/report");
        });
    })
    .catch(error => {
      req.flash("error_msg", "Houve um erro ao editar a Aferição");
      res.redirect("/bal/report");
    });
    }
  });


module.exports = router;
