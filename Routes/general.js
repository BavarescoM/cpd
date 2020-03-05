const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const littleFunc = require("../Helpers/littleFunctions");
router.get("/", (req, res) => {
  res.render("general/index");
});

router.get("/bal", (req, res) => {
  res.render("general/bal/index");
});

module.exports = router;
