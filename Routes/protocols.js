const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../Models/Protocol");
const Protocol = mongoose.model("protocols");
const { zonedTimeToUtc } = require("date-fns-tz");
const {
  parseISO,
  format,
  formatRelative,
  formatDistance
} = require("date-fns");
const ValidationContract = require("../Helpers/validators");
const commandRepo = require('../Repositories/command-Repositorie');

router.get("/protocols/create", (req, res) => {
  res.render("general/protocol/create");
});

router.post("/protocols/save", (req, res) => {
  const newProtocol = {
    user: req.body.user,
    body: req.body.body
  };

  let contract = new ValidationContract();
  contract.isUserRequired(req.body.user,"Selecione um Operador!");
  contract.isUserRequired(req.body.body,"Escreva algo");
  if (!contract.isValid()) {
    var error = contract.errors();
    res.render("general/protocol/create", { error});
    return;
  } else {
  new Protocol(newProtocol)
    .save()
    .then(() => {
      req.flash("success_msg", "Lembrete adiconado com Sucesso");
      res.redirect("/");
    })
    .catch(error => {
      req.flash("error_msg", "Erro ao salvar Lembrete" + error);
    });
  }
});

router.get("/protocols/list", (req, res) => {
  const { page = 1 } = req.query;
  Protocol.paginate({}, { page, limit: 4, sort: { date: -1 } })
    .then(protocol => {
      
      var prox = commandRepo.prox(req.query.page);
      var next = commandRepo.next(protocol.total,req.query.page,protocol.pages);
      var prev = parseInt(req.query.page) - 1;
      var arrDataParsed = [];
      var DateP = protocol.docs.map(function(datep) {
        var firstDate = parseISO(datep.date.toJSON().slice(0, 16));
        var dat = format(firstDate, "dd'/'MM'/'yyyy'");

        arrDataParsed.push({
          page: protocol.page,
          total: protocol.total,
          date: dat,
          user: datep.user,
          body: datep.body,
          id: datep._id
        });
      });
      res.render("general/protocol/list", { arrDataParsed, next, prev, prox });
    })
    .catch(error => {
      req.flash("error_msg", "Erro ao exbir está rota");
      res.redirect("/");
    });
});

router.get("/protocols/delete/:id/:page/:total", (req, res) => {
  const id = req.params.id;
  let page = req.params.page;
  const total = req.params.total;
  if ((page - 1) * 4 + 1 == total) {
    page = page - 1;
  }
  console.log(page);
  Protocol.findByIdAndRemove({ _id: id })
    .then(() => {
      req.flash("success_msg", "Lembrete Deletado com Sucesso!");
      res.redirect(`/protocols/list/?page=${page}`);
    })
    .catch(error => {
      req.flash("error_msg", "Erro ao Deletar Lembrete");
      res.redirect("/protocols/list");
    });
});

router.get("/protocols/edit/:id", (req, res) => {
  Protocol.findById({ _id: req.params.id })
    .then(protocol => {
      res.render("general/protocol/edit", { protocol });
    })
    .catch(error => {
      req.flash("error_msg", "Erro ao Deletar Lembrete");
      res.redirect("/protocols/list");
    });
});

router.post("/protocols/edit", (req, res) => {
  Protocol.findOne({ _id: req.body.id }).then(protocol => {
    (protocol.user = req.body.user), (protocol.body = req.body.body);
    protocol
      .save()
      .then(() => {
        req.flash("success_msg", "Lembrete Editado com sucesso!");
        res.redirect("/protocols/list");
      })
      .catch(error => {
        req.flash("error_msg", "Ocoreu um erro ao Editar!");
        res.redirect("/protocols/list");
      });
  });
});

module.exports = router;
