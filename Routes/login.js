const express = require('express');
const connection = require('../connection');
const bcrypt = require('bcrypt');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res) => {
	res.render('login',{});

    // connection.query('INSERT INTO Login (email,password,category,username,contact) VALUES=?',
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

// router.post('/', (req, res) => {
// 	let errors = [];
// 	const {username, password} = req.body;
// 	connection.query('SELECT username, password FROM login WHERE username=?',
// 	[username],
// 	(err, result, fields)=> {	
// 		if(!err){
// 			if(result.length == 1){
// 				bcrypt.compare(password, result[0].password, function(err, result) {
// 					if (!err) {
// 						if (result) {
// 							res.redirect('/dashboard');
// 						}
// 						else {
// 							errors.push('Incorrect Password!');
// 							res.render('login',{errors});
// 						}
// 					}
// 					else {
// 						res.sendStatus(500);
// 					}
// 				});
// 			}
// 			else{
// 				console.log('query null' + result);
// 				errors.push('Invalid User!');
// 				res.render('login',{
// 					errors
// 				});
// 			}
// 		}
// 		else
// 		{
// 			console.log('query error');
// 			res.sendStatus(500);
// 		}
// 	});
// });

router.post('/', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/login',
		failureFlash: true
	})(req, res, next);
});
module.exports = router;