// rename this route to register or modularize this
const express = require('express');
const connection = require('../connection');

const router = express.Router();

// router.post('/', (req,res)=>{
// 	let email = req.body.email;
// 	let password = req.body.password;
// 	let category = req.body.category;
// 	let username = req.body.username;

// 	connection.query('INSERT INTO Login (email,password,category,username,contact) VALUES ?',
// 	[email,password,category,username,contact],
// 	(err, result)=> {
// 		if(!err){
// 			res.send(req.body);
// 		}
// 		else
// 		{
// 			res.send('0');
// 		}
// 	});

// });

router.get('/order', (req, res) => {
	let cities;
	let products;
	let deliver;
	connection.query('SELECT id, city FROM places',
		(err, result, fields) => {
			if (!err) {
				result.forEach(element => {
					cities = result;
				});
				connection.query('SELECT id, name FROM products',
					(err, result, fields) => {
						if (!err) {
							products = result;
							connection.query('SELECT id, vehicle_no FROM delivery_system',
								(err, result, fields) => {
									if (!err) {
										result.forEach(element => {
											deliver = result;
										});
										res.render('trip', { 
											cities, 
											products, 
											deliver 
										});
									}
									else {
										res.sendStatus(500);
									}
								});
						}
						else {
							res.sendStatus(500);
						}
					});
			}
			else {
				res.sendStatus(500);
			}
		});
});
router.post('/order', (req, res) => {
	let source_id = req.body.source_id;
	let destination_id = req.body.destination_id;
	let product_id = req.body.product_id;
	let delivery_id = req.body.delivery_id;


	connection.query('INSERT INTO orders (source_id,	destination_id, product_id, delivery_id ) VALUES (?)',
		[[source_id, destination_id, product_id, delivery_id]],
		(err, result) => {
			if (!err) {
				res.send(req.body);
			}
			else {
				res.send('0');
			}
		});

});

router.get('/deliver', (req, res) => {
	res.render('delivery', {});
});
//deliver route after session implimentation add login id
router.post('/deliver', (req, res) => {
	let name = req.body.name;
	let designation = req.body.designation;
	let vehicleno = req.body.vehicleno;
	let login_id = null; // imp


	connection.query('INSERT INTO delivery_system (name, designation, vehicle_no ) VALUES (?)',
		[[name, designation, vehicleno]],
		(err, result) => {
			if (!err) {
				res.send(req.body);
			}
			else {
				res.send('0');
			}
		});

});

router.get('/places', (req, res) => {
	res.render('places', {});
});
router.post('/places', (req, res) => {
	let area = req.body.area;
	let place_type = req.body.place_type;
	let state = req.body.state;
	let city = req.body.city;
	let country = req.body.country;
	let pincode = req.body.pincode;


	connection.query('INSERT INTO places (area,place_type,state,city,country,pincode) VALUES (?)',
		[[area, place_type, state, city, country, pincode]],
		(err, result) => {
			if (!err) {
				res.send(result); //must be redirected to dashboard
			}
			else {
				res.sendStatus(500);
			}
		});

});

router.get('/product', (req, res) => {
	res.render('product', {});
});
router.post('/product', (req, res) => {
	let name = req.body.name;
	let where_made = req.body.where_made;
	let product_state = req.body.productstate;



	connection.query('INSERT INTO products (name,	where_made, product_state) VALUES (?)',
		[[name, where_made, product_state]],
		(err, result) => {
			if (!err) {
				res.send(result);
			}
			else {
				res.send('0');
			}
		});

});

module.exports = router;