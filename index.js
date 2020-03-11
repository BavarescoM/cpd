"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const handlebars = require("express-handlebars");
var app = express();
const router = express.Router();
const session = require("express-session");
var cookieParser = require("cookie-parser");
var flash = require("connect-flash");

const db = require("./Config/db");
const general = require("./Routes/general");
const commands = require("./Routes/commands");

/*
app.use(session({
  secret: 'happy dog', cookie: { maxAge: 30000000 },
  saveUninitialized: true,
  resave: true
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.message = req.flash('success_msg');
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});
*/

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

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log("servidor rodando");
});
