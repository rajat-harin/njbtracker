const express = require('express');
const connection = require('../connection');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('signup', {});

	// connection.query('INSERT INTO Login (email,password,category,username,contact) VALUES ?',
	// [email,password,category,username,contact],
	// (err, result)=> {
	// 	if(!err){
	// 		res.send(req.body);
	// 	}
	// 	else
	// 	{
	// 		res.send('0');
	// 	}
	// });
});

router.post('/', (req, res) => {
	const {name, contact, email, username, password, category} = req.body;	
	const saltRounds = 10;

	bcrypt.genSalt(saltRounds, function (err, salt) {
		if (!err) {
			bcrypt.hash(password, salt, function (err, hash) {
				if (!err) {
					connection.query("INSERT INTO login (email,password,category,username,contact,name) VALUES  (?)",
						[[email, hash, category, username, contact, name]],
						(err, result) => {
							if (!err) {
								req.flash('success_msg','You are Registered Successfully');
								res.redirect('/login');
							}
							else {
								res.status(500).send(err);
							}
						});
				}
				else {
					res.status(500).send(err);
				}
			});
		}
		else {
			res.status(500).send(err);
		}
	});

});



module.exports = router;