const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../Models/Protocol");
const Protocol = mongoose.model("protocols");

router.get("/protocols/create", (req, res) => {
  res.render("general/protocol/create");
});

router.post("/protocols/save", (req, res) => {
  console.log(req.body.user);
  const newProtocol = {
    user: req.body.user,
    body: req.body.body
  };
  new Protocol(newProtocol)
    .save()
    .then(() => {
      req.flash("success_msg", "Lembrete adiconado com Sucesso");
      res.redirect("/protocols/create");
    })
    .catch(error => {
      req.flash("error_msg", "Erro ao salvar Lembrete" + error);
    });
});
module.exports = router;
