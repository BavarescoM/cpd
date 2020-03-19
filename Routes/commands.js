const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../Models/Command");
const Command = mongoose.model("commands");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/commands/create", adminAuth, (req, res) => {
  res.render("admin/commands/create");
});

router.post("/admin/commands/save", adminAuth, (req, res) => {
  const newCommand = {
    title: req.body.title,
    body: req.body.body
  };

  new Command(newCommand)
    .save()
    .then(() => {
      req.flash("success_msg", "Comando criado com Sucesso!");
      res.redirect("/admin/commands/create");
    })
    .catch(error => {
      req.flash("error_msg", "Erro ao salvar Comando" + error);
    });
});

router.get("/admin/commands/index", adminAuth, (req, res) => {
  Command.find().then(commands => {
    res.render("admin/commands/index", { commands });
  });
});

router.get("/admin/commands/edit/:id", adminAuth, (req, res) => {
  Command.findById({ _id: req.params.id }).then(commands => {
    console.log(commands);
    res.render("admin/commands/edit", { commands });
  });
});

router.post("/admin/commands/edit", adminAuth, (req, res) => {
  var id = req.body.id;
  console.log(id);
  Command.findById({ _id: id }).then(commands => {
    console.log(commands);
    console.log(req.body.title);

    (commands.title = req.body.title), (commands.body = req.body.body);
    commands
      .save()
      .then(() => {
        res.redirect("/admin/commands/index");
        console.log("comando atualizado" + commands);
      })
      .catch(error => {
        console.log("erro ao salvar");
      });
  });
});

router.get("/admin/commands/delete/:id", adminAuth, (req, res) => {
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

router.get("/admin/commands/list", (req, res) => {
  Command.find().then(commands => {
    res.render("admin/commands/list", { commands });
  });
});

router.get("/admin/commands/list/:id", (req, res) => {
  Command.findOne({ _id: req.params.id }).then(commands => {
    res.render("admin/commands/list-details", { commands });
  });
});

module.exports = router;
