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
const excelBal = require('../helpers/excelBal');
require("../Models/Balance");
const Balance = mongoose.model("balances");

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

router.get("/excelG/:month?", (req, res) => {
	let contract = new ValidationContract();
	contract.isRequired(req.params.month, "Selecione um Período");

	if (!contract.isValid()) {
		var error = contract.errors();
		res.render("general/report/index", { error });
		return;
	} else {

		var regexp = new RegExp("^" + req.params.month);
		var writeStream = fs.createWriteStream("Afericao.xls");

		var header =
		"Data" +
		"\t" +
		" Usuario" +
		"\t" +
		" Periodo" +
		"\n";
		writeStream.write(header);
		Gauging.find({ date: regexp }).sort({date:'asc'}).then(gau => {
			for (var index = 0; index < gau.length; index++) {
				var row1 =
				gau[index].date+
				"\t" +
				gau[index].user+
				"\t" +
				gau[index].period+
				"\n";
				writeStream.write(row1);
			}

			writeStream.close();
			setTimeout(function() {
				res.download("Afericao.xls", "Afericao.xls");
			}, 5000);
		})
	}
})

router.get("/excelB/:month?", (req, res) => {
	let contract = new ValidationContract();
	contract.isRequired(req.params.month, "Selecione um Período");

	if (!contract.isValid()) {
		var error = contract.errors();
		res.render("general/report/index", { error });
		return;
	} else {


		var regexp = new RegExp("^" + req.params.month);
		var writeStream = fs.createWriteStream("file.xls");
		Balance.find({ date: regexp }).sort({date:'asc'}).then(bal => {

			var arrBal = [];
			for (var i=10; i< 21; i++){
				arrBal.push("\t"+"Bal"+[i])}
				var header =
				"Data" +
				"\t" +
				" Usuario" +
				arrBal
				+"\n";
				writeStream.write(header);
				for (var index = 0; index < bal.length; index++) {
					function rep(value) {
						if (value == "on") {
							value = "ok";
							return value;
						} else {
							value = "";
							return value;
						}
					}
					var row1 =
					bal[index].date +
					"\t" +
					bal[index].user +
					"\t" +
					rep(bal[index].bal10) +
					"\t" +
					rep(bal[index].bal11) +
					"\t" +
					rep(bal[index].bal12) +
					"\t" +
					rep(bal[index].bal13) +
					"\t" +
					rep(bal[index].bal14) +
					"\t" +
					rep(bal[index].bal15) +
					"\t" +
					rep(bal[index].bal16) +
					"\t" +
					rep(bal[index].bal17) +
					"\t" +
					rep(bal[index].bal18) +
					"\t" +
					rep(bal[index].bal19) +
					"\t" +
					rep(bal[index].bal20) +
					"\n";
					writeStream.write(row1);
				}
				writeStream.close();
				setTimeout(function() {
					res.download("file.xls", "EXCEL.xls");
    }, 5000); // ver async await depois
			});
	}
});
module.exports = router;
