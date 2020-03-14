const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ValidationContract = require("../Helpers/validators");
require("../Models/Balance");
const Balance = mongoose.model("balances");
const { zonedTimeToUtc } = require("date-fns-tz");
const pt = require("date-fns/locale/pt");
require("../Models/Protocol");
const Protocol = mongoose.model("protocols");
var fs = require("fs");

const {
  parseISO,
  format,
  formatRelative,
  formatDistance
} = require("date-fns");

router.get("/", (req, res) => {
  var utc = new Date().toJSON().slice(0, 10);
  const firstDate = parseISO(utc);
  // const znDate = zonedTimeToUtc(firstDate, "America/Sao_Paulo");
  const formattedDate = format(firstDate, "dd'/'MM'/'yyyy'");
  Balance.find({ date: utc }).then(status => {
    var statusBalA = false;
    var statusBalM = false;
    if (status.length == 1) {
      if (status[0].period == "Tarde") {
        statusBalA = true;
      }
      if (status[0].period == "Manhã") {
        statusBalM = true;
      }
    } else {
      if (status.length == 0) {
        statusBalA = false;
        statusBalM = false;
      } else {
        if (status[0].period == "Tarde" || status[1].period == "Tarde") {
          statusBalA = true;
        }
        if (status[0].period == "Manhã" || status[1].period == "Manhã") {
          statusBalM = true;
        }
      }
    }
    const { page = 1 } = req.query;
    Protocol.paginate({}, { page, limit: 4 })
      .then(protocol => {
        var arrD = [];
        var DateP = protocol.docs.map(function (datep) {
          var firstDate = parseISO(datep.date.toJSON().slice(0, 16));
          const znDate = zonedTimeToUtc(firstDate, "America/Sao_Paulo");
          var dat = format(znDate, "dd'/'MM'/'yyyy'");
          arrD.push({
            dat: dat,
            user: datep.user,
            body: datep.body,
            id: datep._id
          });

        });
        arrD.push({ total: protocol.total, limit: protocol.limit, page: protocol.page, pages: protocol.pages })
        console.log(arrD);
        res.render("general/index", {
          arrD,
          statusBalA,
          statusBalM,
          formattedDate
        });
      })
      .catch(error => {
        req.flash("error_msg", "Erro ao carregar Ata");
        res.redirect("/");
      });
  });
});

router.get("/bal", (req, res) => {
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
  await Balance.findOne({ date: bal.date, period: bal.period }).then(ret => {
    if (ret != null) {
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
    res.render("general/bal/index", { error, bal });
    return;
  } else {
    new Balance(bal)
      .save()
      .then(() => {
        req.flash("success_msg", "Aferição Cadastrada com Sucesso");
        res.redirect("/bal");
      })
      .catch(error => {
        req.flash("error_msg", "Erro ao Cadastrar" + error);
      });
  }
});

router.get("/bal/report", (req, res) => {
  Balance.find()
    .sort({ date: -1 })
    .then(bal => {
      res.render("general/bal/report", { bal });
    });
});
router.get("/excel", (req, res) => {
  var writeStream = fs.createWriteStream("file.xls");
  Balance.find().then(bal => {
    var header =
      "Data" +
      "\t" +
      " Usuario" +
      "\t" +
      "Periodo" +
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
    writeStream.write(header);
    for (var index = 0; index < bal.length; index++) {
      var row1 =
        bal[index].date +
          "\t" +
          bal[index].user +
          "\t" +
          bal[index].period +
          "\t" +
          bal[index].bal10 ? "ok" : "" +
            "\t" +
            bal[index].bal11 ? "ok" : "" +
              "\t" +
              bal[index].bal12 ? "ok" : "" +
                "\t" +
                bal[index].bal13 ? "ok" : "" +
                  "\t" +
                  bal[index].bal14 ? "ok" : "" +
                    "\t" +
                    bal[index].bal15 ? "ok" : "" +
                      "\t" +
                      bal[index].bal16 ? "ok" : "" +
                        "\t" +
                        bal[index].bal17 ? "ok" : "" +
                          "\t" +
                          bal[index].bal18 ? "ok" : "" +
                            "\t" +
                            bal[index].bal19 ? "ok" : "" +
                              "\t" +
                              bal[index].bal20 ? "ok" : "" +
                              "\n";
      writeStream.write(row1);
    }
    console.log(header + row1);

    //writeStream.write(row2);
    writeStream.close();
    console.log("passou aki");
    res.redirect("/bal/report");
  });
});

router.get("/bal/delete/:id", (req, res) => {
  const id = req.params.id;
  Balance.findOneAndRemove({ _id: id })
    .then(() => {
      req.flash("success_msg", "Deletado com Sucesso");
      res.redirect("/bal/report");
    })
    .catch(error => {
      req.flash("msg_error", "Erro ao Deletar" + error);
    });
});

router.get("/bal/edit/:id", (req, res) => {
  const id = req.params.id;
  Balance.findById({ _id: id }).then(balance => {
    res.render("general/bal/edit", { balance });
  });
});

router.post("/bal/edit", async (req, res) => {
  let bo;
  console.log(req.body.id);
  console.log(req.body.date);
  await Balance.find({ date: req.body.date, period: req.body.period }).then(
    ret => {
      console.log(ret);
      if (ret == "") {
      } else {
        if (ret[0].id != req.body.id) {
          if (ret != null) {
            bo = 0;
          }
        }
      }
    }
  );
  let contract = new ValidationContract();

  contract.isUserRequired(bo, "Já foi feita aferição neste Turno");
  contract.isBalEmpty(
    req.body,
    "Deve preencher pelo menos um campo de balança"
  );

  if (!contract.isValid()) {
    var error = contract.errors();
    console.log(error);
    req.flash("error_form", error);
    res.redirect(`/bal/edit/${req.body.id}`);
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
            req.flash("success_msg", "Aferição Editada com Sucesso!");
            res.redirect("/bal/report");
          })
          .catch(error => {
            req.flash(
              "error_msg",
              "Houve um erro ao editar a Aferição",
              +error
            );
            res.redirect(`/bal/edit/${req.body.id}`);
          });
      })
      .catch(error => {
        req.flash("error_msg", "Houve um erro ao editar a Aferição" + error);
        res.redirect("/bal/report");
      });
  }
});

module.exports = router;
