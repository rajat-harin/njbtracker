const express = require("express");
const connection = require("../connection");

const router = express.Router();

router.post("/login", (req, res) => {
  let errors = [];
  const { username, password } = req.body;
  console.log(req.body);

  connection.query(
    "SELECT * FROM login WHERE username=$1",
    [username],
    (err, result) => {
      if (!err) {
        if (result.rowCount == 1) {
          if (password == result.rows[0].password) {
            res.send(result.rows);
          } else {
            res.send("0");
          }
        } else {
          res.send("-1");
          console.log("no user");
        }
      } else {
        console.log("query error");
        res.send("-2");
      }
    }
  );
});

router.post("/register", (req, res) => {
  const { name, contact, email, username, password, category } = req.body;

  connection.query(
    "INSERT INTO login (email,password,category,username,contact,name) VALUES  ($1,$2,$3,$4,$5,$6)",
    [email, password, category, username, contact, name],
    (err, result) => {
      if (!err) {
        var message = {
          "category":category,
          "username":username,
          "password":password,
          "abcd":result.insertid
      };
        res.send(message);
      } else {
        res.send("-1");
        console.log(err);
      }
    }
  );
});

router.post("/places", (req, res) => {
  let area = req.body.area;
  let place_type = req.body.place_type;
  let state = req.body.state;
  let city = req.body.city;
  let country = req.body.country;
  let pincode = req.body.pincode;

  connection.query(
    "INSERT INTO places (area,place_type,state,city,country,pincode) VALUES ($1,$2,$3,$4,$5,$6)",
    [area, place_type, state, city, country, pincode],
    (err, result) => {
      if (!err) {
        res.send("1"); //must be redirected to dashboard
      } else {
        console.log(err);
        res.send("-1");
      }
    }
  );
});

router.post("/product", (req, res) => {
  let name = req.body.name;
  let where_made = req.body.where_made;
  let product_state = req.body.productstate;

  connection.query(
    "INSERT INTO products (name,	where_made, product_state) VALUES ($1,$2,$3)",
    [name, where_made, product_state],
    (err, result) => {
      if (!err) {
        res.send("1");
      } else {
        res.send("-1");
      }
    }
  );
});

router.post("/deliver", (req, res) => {
  let name = req.body.name;
  let designation = req.body.designation;
  let vehicleno = req.body.vehicleno;
  // let login_id = req.user.id; // imp

  connection.query(
    "INSERT INTO delivery_system (name, designation, vehicle_no) VALUES ($1,$2,$3)",
    [name, designation, vehicleno],
    (err, result) => {
      if (!err) {
        res.send("1");
      } else {
        res.send("-1");
      }
    }
  );
});

router.get("/order", (req, res) => {
  let delivery_id = req.body.id;
  connection.query(
    "SELECT * FROM orders WHERE delivery_id = $1",
    [delivery_id],
    (err, result) => {
      if (!err) {
        res.send(result.rows[0]);
      } else {
        res.send("-1");
      }
    }
  );
});

router.get("/orderall", (req, res) => {
  connection.query("SELECT * FROM orders", (err, result) => {
    if (!err) {
      res.send(result.rows);
    } else {
      res.send("-1");
    }
  });
});

router.post("/order", (req, res) => {
  let source_id = req.body.source_id;
  let destination_id = req.body.destination_id;
  let product_id = req.body.product_id;
  let delivery_id = req.body.delivery_id;

  connection.query(
    "INSERT INTO orders (source_id,	destination_id, product_id, delivery_id ) VALUES ($1,$2,$3,$4)",
    [source_id, destination_id, product_id, delivery_id],
    (err, result) => {
      if (!err) {
        res.send("1");
      } else {
        res.send("-1");
      }
    }
  );
});

// router.get("/places", (req, res) => {
//   res.render("places", { layout: "dashboard" });
// });

// router.get("/product", (req, res) => {
//   res.render("product", { layout: "dashboard" });
// });
// router.get("/deliver", (req, res) => {
//   res.render("delivery", { layout: "dashboard" });
// });
//deliver route after session implimentation add login id

module.exports = router;
