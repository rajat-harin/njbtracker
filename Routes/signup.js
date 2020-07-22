const express = require("express");
const connection = require("../connection");
const bcrypt = require("bcrypt");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("signup", {});

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

router.post("/", (req, res) => {
  const { name, contact, email, username, password, category } = req.body;

  connection.query(
    "INSERT INTO login (email,password,category,username,contact,name) VALUES  ($1,$2,$3,$4,$5,$6)",
    [email, password, category, username, contact, name],
    (err, result) => {
      if (!err) {
        req.flash("success_msg", "You are Registered Successfully");
        res.redirect("/login");
      } else {
        res.status(500).send(err);
        console.log(err);
      }
    }
  );
});

module.exports = router;
