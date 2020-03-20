const express = require("express");
const router = express.Router();
const ValidationContract = require("../Helpers/validators");

router.get("/login", (req, res) => {
  res.render("admin/login/index");
});

router.post("/login/save", (req, res) => {
  let contract = new ValidationContract();
  contract.isRequired(req.body.login, "Campo Login é Obrigatório");
  contract.isRequired(req.body.password, "Campo Senha é Obrigatório");
  if (!contract.isValid()) {
    var error = contract.errors();
    res.render("admin/login/index", { error });
    return;
  } else {
    if (req.body.login == "cpd203" && req.body.password == "123") {
      req.session.user = {
        user: req.body.login
      };
      req.flash("success_msg", "Bem Vindo ao Sismado do CPD203");
      res.redirect("/");
    } else {
      req.flash("error_msg", "Tente Novamente");
      res.redirect("/login");
    }
  }
});

router.get("/logout", (req, res) => {
  req.session.user = undefined;
  res.redirect("/");
});

module.exports = router;
