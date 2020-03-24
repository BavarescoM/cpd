const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ValidationContract = require("../Helpers/validators");
require("../Models/Balance");
const Balance = mongoose.model("balances");
const { toDate, utcToZonedTime, zonedTimeToUtc } = require("date-fns-tz");
const pt = require("date-fns/locale/pt");
require("../Models/Protocol");
require("../Models/Gauging");
const Gauging = mongoose.model("gaugings");
const Protocol = mongoose.model("protocols");
var fs = require("fs");
var pdf = require("html-pdf");
const handlebars = require("handlebars");
const {
  parseISO,
  format,
  formatRelative,
  formatDistance
} = require("date-fns");
const commandRepo = require('../Repositories/command-Repositorie');

router.get("/", (req, res) => {
  var date = new Date().toJSON().slice(0, 10);
  var dateTime = new Date().toJSON().slice(0, 16);
  const formattedDate = commandRepo.homeDate(dateTime);

  Gauging.find({ date: date }).then(status => {
    var statusBalM = commandRepo.statusBal(status,"Manhã");
    var statusBalA = commandRepo.statusBal(status,"Tarde");

    const { page = 1 } = req.query;
    Protocol.paginate({}, { page, limit: 4, sort: { createdAt: -1 } })
      .then(protocol => {
        var arrD = [];
        var DateP = protocol.docs.map(function(datep) {
          const utcDate = toDate(datep.date, { timeZone: "UTC" });
          const zonedDate = utcToZonedTime(utcDate, "America/Sao_Paulo");
          var dat = format(zonedDate, "dd-MM-yyyy HH:mm", {
            timeZone: "America/Sao_Paulo"
          });
          arrD.push({
            dat: dat,
            user: datep.user,
            body: datep.body,
            id: datep._id
          });
        });
        console.log(req.query.page);
        var prox = commandRepo.prox(req.query.page);
        var next = commandRepo.next(protocol.total,req.query.page,protocol.pages);
        var prev = parseInt(req.query.page) - 1;
        res.render("general/index", {
          prev,
          prox,
          next,
          arrD,
          statusBalA,
          statusBalM,
          formattedDate
        });
      })
      .catch(error => {
        req.flash("error_msg", "Erro ao carregar Ata" + error);
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
  var utc = new Date().toJSON().slice(0, 7);
  var regexp = new RegExp("^" + utc);
  var auxmonth = 0;
  
  Balance.find({ date: regexp })
    .sort({ date: -1 })
    .then(bal => {
      res.render("general/bal/report", { bal, auxmonth, utc });
    });
});
router.get("/excel/:month?", (req, res) => {
  console.log(req.params.month);
  if (req.params.month == 0) {
    var utc = new Date().toJSON().slice(0, 7);
    var regexp = new RegExp("^" + utc);
  } else {
    var regexp = new RegExp("^" + req.params.month);
  }
  console.log(regexp);
  var writeStream = fs.createWriteStream("file.xls");
  Balance.find({ date: regexp }).then(bal => {
    console.log(bal);
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
    }
    writeStream.close();
    setTimeout(function() {
      res.download("file.xls", "EXCEL.xls");
    }, 5000); // ver async await depois
  });
});

router.get("/pdf", async (req, res) => {
  var auxpdf = true;
  Balance.find({}).then(bal => {
    var html = fs.readFileSync("./views/general/bal/report.handlebars", "utf8");
    var template = handlebars.compile(html);
    var parsehtml = template({ bal,auxpdf });
    console.log(bal);

    var options = { orientation: "landscape" };

    pdf.create(parsehtml, options).toFile("./meupdf.pdf", (err, reso) => {
      if (err) {
        console.log("erro");
      } else {
        console.log(reso);
        res.download(reso.filename, "mypdf.pdf");
      }
    });
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

router.post("/report/month", (req, res) => {
  var regexp = new RegExp("^" + req.body.month);
  var auxmonth = req.body.month;
  var remonth = req.body.month.split("");

  var month =
    remonth[5] +
    remonth[6] +
    remonth[4] +
    remonth[0] +
    remonth[1] +
    remonth[2] +
    remonth[3];

  Balance.find({ date: regexp })
    .then(bal => {
      res.render("general/bal/report", { bal, month, auxmonth });
    })
    .catch(error => {
      console.log("bo" + error);
      res.redirect("/bal/report");
    });
});

module.exports = router;
