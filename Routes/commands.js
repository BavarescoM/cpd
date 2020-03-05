const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../Models/Command");
const Command = mongoose.model("commands");

router.get("/admin/commands/create", (req, res) => {
  res.render("admin/commands/create");
});

router.post("/admin/commands/save", (req, res) => {
  const newCommand = {
    title: req.body.title,
    body: req.body.body
  };
  new Command(newCommand)
    .save()
    .then(() => {
      console.log("Comando Salvo com Sucesso");
      res.redirect("/admin/commands/create");
    })
    .catch(error => {
      console.log("Erro ao salvar Comando" + error);
    });
});

router.get("/admin/commands/index", (req, res) => {
  Command.find().then(commands => {
    res.render("admin/commands/index", { commands: commands });
  });
});

router.get("/admin/commands/edit/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  Command.findById({ _id: id }).then(commands => {
    res.render("admin/commands/edit", { commands: commands });
  });
});

router.get("/admin/commands/delete/:id", (req, res) => {
  const id = req.params.id;
  Command.findOneAndRemove({ _id: id })
    .then(() => {
      console.log("Deletado com Sucesso");
      res.redirect("/admin/commands/index");
    })
    .catch(error => {
      alert("erro ao deletar" + error);
    });
});
module.exports = router;
