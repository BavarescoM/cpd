const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../Models/Gauging");
const Gauging = mongoose.model("gaugings");
//const adminAuth = require("../middlewares/adminAuth");
const gaugingpdf = require("../Helpers/gaugingpdf");
const {
  parseISO,
  format,
  formatRelative,
  formatDistance
} = require("date-fns");
var pdf = require("html-pdf");
var fs = require("fs");

router.get("/gauging/create", (req, res) => {
  res.render("general/gauging/create");
});

router.get("/gauging/list", (req, res) => {
  const { page = 1 } = req.query;
  Gauging.paginate({}, { page, limit: 8, sort: { date: -1 } }).then(gauging => {
    var arrD = [];
    var DateP = gauging.docs.map(function(datep) {
      var Parsedate = datep.date.split("-");
      arrD.push({
        date: Parsedate[2] + "/" + +Parsedate[1] + "/" + +Parsedate[0],
        user: datep.user,
        period: datep.period,
        id: datep._id,
        total: gauging.total,
        page: gauging.page
      });
    });
    var prox = parseInt(req.query.page) + 1;
    if (req.query.page == undefined) {
      prox = 2;
    }
    var next;
    if (parseInt(req.query.page) != parseInt(gauging.pages)) {
      next = true;
    } else {
      next = false;
    }
    var prev;
    prev = parseInt(req.query.page) - 1;

    res.render("general/gauging/list", { prev, prox, next, arrD });
  });
});

router.post("/gauging/save", (req, res) => {
  console.log(req.body);
  var newGauging = {
    date: req.body.date,
    user: req.body.user,
    period: req.body.period
  };
  new Gauging(newGauging).save().then(() => {
    req.flash("success_msg", "Aferição Cadastrada com Sucesso!");
    res.redirect("/gauging/create");
  });
});

router.get("/gauging/edit/:id", (req, res) => {
  Gauging.findById({ _id: req.params.id }).then(data => {
    res.render("general/gauging/edit");
  });
});

router.post("/gauging/find", (req, res) => {
  var regexp = new RegExp("^" + req.body.month);
  //console.log(regexp);
  const { page = 1 } = req.query;

  var gau = Gauging.paginate({ date: regexp }, { page, limit: 8 });
  console.log(gau);
  res.render("general/gauging/list");
});



router.get("/gauging/delete/:id/:page/:total", (req, res) => {
  const id = req.params.id;
  let page = req.params.page;
  const total = req.params.total;
  if ((page - 1) * 8 + 1 == total) {
    page = page - 1;
  }
  console.log(page);
  Gauging.deleteOne({ _id: req.params.id })
    .then(() => {
      req.flash("success_msg", "Deletado com Sucesso!");
      res.redirect(`/gauging/list/?page=${page}`);
    })
    .catch(error => {
      x;
      req.flash("error_msg", "Houve um erro ao Deletar!");
    });
});

router.get("/test", (req, res) => {
  res.render("test");
});
module.exports = router;
