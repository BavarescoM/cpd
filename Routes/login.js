const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  res.render("admin/login/index");
});

router.post("/login/save", (req, res) => {
  console.log(req.body.login);
  console.log(req.body.password);
  if (req.body.login == "cpd203" && req.body.password == "123") {
    req.session.user = {
      user: req.body.login
    };
    req.flash("success_msg", "bombou");
    res.redirect("/login");
  } else {
    req.flash("error_msg", "Tente Novamente");
    res.redirect("/login");
  }
});

router.get("/logout", (req, res) => {
  req.session.user = undefined;
  res.redirect("/");
});

module.exports = router;
