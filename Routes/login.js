const express = require("express");
const connection = require("../connection");
//const bcrypt = require("bcrypt");
const router = express.Router();
const passport = require("passport");

router.get("/", (req, res) => {
  res.render("login", {});

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

router.post("/", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});
module.exports = router;
