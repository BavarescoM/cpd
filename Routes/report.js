const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../Models/Gauging");
const Gauging = mongoose.model("gaugings");
//const adminAuth = require("../middlewares/adminAuth");
const gaugingpdf = require("../Helpers/gaugingpdf");
const balpdf = require("../Helpers/balpdf");
var pdf = require("html-pdf");
var fs = require("fs");
const ValidationContract = require("../Helpers/validators");

router.get('/admin/report', (req,res)=> {
	res.render('general/report/index');
})


router.post('/admin/report/searchBalance', (req,res)=> {
	let contract = new ValidationContract();
  	contract.isRequired(req.body.monthb, "Selecione um Período");

   if (!contract.isValid()) {
    var error = contract.errors();
    res.render("general/report/index", { error });
    return;
  } else {
	var pdfBmonth = req.body.monthb;
	var auxmonth = (req.body.monthb).split("-");
	var monthB = auxmonth[1]+'/'+auxmonth[0];
	res.render('general/report/index', {monthB, pdfBmonth});
	}
});

router.post('/admin/report/searchGauging/', (req,res)=> {
	let contract = new ValidationContract();
  contract.isRequired(req.body.monthg, "Selecione um Período");

   if (!contract.isValid()) {
    var error = contract.errors();
    res.render("general/report/index", { error });
    return;
  } else {
	var pdfGmonth = req.body.monthg;
	var auxmonth = (req.body.monthg).split("-");
	var monthG = auxmonth[1]+'/'+auxmonth[0];
	res.render('general/report/index', {monthG, pdfGmonth});
	}
});

router.get("/gauging/pdf/:pdf?", async (req, res) => {	
  
  let contract = new ValidationContract();
  contract.isRequired(req.params.pdf, "Selecione um Período");

   if (!contract.isValid()) {
    var error = contract.errors();
    res.render("general/report/index", { error });
    return;
  } else {
	  var regexp = new RegExp("^" + req.params.pdf);
	  var html = await gaugingpdf.pdf(regexp,req.params.pdf);
	  pdf.create(html).toFile("./meupdf.pdf", async (err, reso) => {
	    if (err) {
	      console.log("erro");
	    } else {
	      res.download(reso.filename, "mypdf.pdf");
	    }
	  });
	}
});

router.get("/balance/pdf/:pdf?", async (req, res) => {	
  
  let contract = new ValidationContract();
  contract.isRequired(req.params.pdf, "Selecione um Período");

   if (!contract.isValid()) {
    var error = contract.errors();
    res.render("general/report/index", { error });
    return;
  } else {
	  var regexp = new RegExp("^" + req.params.pdf);
	  var html = await balpdf.pdf(regexp,req.params.pdf);
	  var options = { orientation: "landscape" };
	  pdf.create(html,options).toFile("./bal.pdf", async (err, reso) => {
	    if (err) {
	      console.log("erro");
	    } else {
	      res.download(reso.filename, "ball.pdf");
	    }
	  });
	}
});
module.exports = router;
