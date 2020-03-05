const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require('../Models/Command');
const Command = mongoose.model('commands');

router.get("/admin/commands/create", (req, res) => {
	res.render("admin/commands/create");
});

router.post('/admin/commands/save', (req, res) => {
	const newCommand = {
		title: req.body.title,
		body: req.body.body
	}
	new Command(newCommand).save().then(() => {
		console.log('Comando Salvo com Sucesso');
		res.redirect('/admin/commands/create');
	}).catch(error => {
		console.log('Erro ao salvar Comando' + error);
	})
})

router.get('/admin/commands/index', (req, res) => {
	Command.find().then((commands) => {
		console.log(commands + 'passou')
		res.render('admin/commands/index', { commands: commands });
	})
})

module.exports = router;
