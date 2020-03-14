"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const handlebars = require("express-handlebars");
var app = express();
const router = express.Router();

var cookieParser = require("cookie-parser");

const db = require("./Config/db");
const general = require("./Routes/general");
const commands = require("./Routes/commands");

const session = require("express-session");
const flash = require("connect-flash");
const protocols = require("./Routes/protocols");

app.use(cookieParser("secret"));

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);
app.use(flash());
//middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_form = req.flash("error_form");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

//body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//handlebars
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//banco
mongoose
  .connect(db.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("conectado mongo");
  })
  .catch(error => {
    console.log("erro mgdb" + error);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//public
//app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname + "/public"));

app.use("/", general);
app.use("/", commands);
app.use("/", protocols);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log("servidor rodando");
});
