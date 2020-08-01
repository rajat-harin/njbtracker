const express = require("express");
const connection = require("../connection");
const connection1 = require("../connection");
const connection2 = require("../connection");

const router = express.Router();

router.post("/login", (req, res) => {
    let errors = [];
    const {username, password} = req.body;
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
    const {name, contact, email, username, password, category} = req.body;

    connection.query(
        "INSERT INTO login (email,password,category,username,contact,name) VALUES  ($1,$2,$3,$4,$5,$6)",
        [email, password, category, username, contact, name],
        (err, result) => {
            if (!err) {
                var id;
                "SELECT * FROM login WHERE username=$1,$2",
                    [username, password],
                    (err, result) => {
                        if (!err) {
                            if (result.rowCount == 1) {
                                if (password == result.rows[0].password) {
                                    id = rows;
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
                    };

                var message = {
                    category: category,
                    username: username,
                    password: password,
                    loginid: id,
                };
                res.send(message);
            } else {
                res.send("-1");
                console.log(err);
            }
        }
    );
});

router.post("/trip_info", (req, res) => {

    let id = req.body.id;
    var final = {};
    connection.query(
        "select name from products ",
        [id], (err, result) => {
            if (!err) {
                final.product = result.row;
                res.send(final);
            } else {
                res.send("-1");
            }
        }
    );
    connection1.query("select * from places where id in (select source_id from orders where delivery_id in (select id from delivery_system where login_id=$1 ))", [id], (err1, result1) => {
        if (!err1) {
            final.source = result1.row;
            // res.send(final);
        } else {
            res.send("-1");
        }
    });

    connection2.query("select * from places where id in (select destination_id from orders where delivery_id in (select id from delivery_system where login_id=$1 ))", [id], (err2, result2) => {
        if (!err2) {
            final.destination = result2.row;
        } else {
            res.send("-1");
        }
    });
    res.send(final);

});

router.post("/order_info", (req, res) => {
    var final = {};
    const id1 = req.body.id;
    // res.send("abd");
    console.log(id1);
    connection.query(
        "SELECT * FROM orders where senders_id = $1",
        [id1],
        (err, result1) => {
            if (!err) {
                // res.send(result.rows);
                final.orders = result1.rows;
                const id2 = result1.rows.product_id;
                console.log(id2);
                connection.query(
                    "select * from products where id=$1",
                    [id2],
                    (err, result2) => {
                        if (!err) {
                            final.products = result2.rows;
                        } else {
                            final = -1;
                        }
                    }
                );
            } else {
                res.send("-1");
            }
            res.send(final);
        }
    );
});

router.post("/enter_places", (req, res) => {
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

router.post("/product_description", (req, res) => {
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

router.post("/delivery_system", (req, res) => {
    let name = req.body.name;
    let designation = req.body.designation;
    let vehicleno = req.body.vehicleno;
    let login_id = req.body.login_id;

    connection.query(
        "INSERT INTO delivery_system (name, designation, vehicle_no,login_id) VALUES ($1,$2,$3,$4)",
        [name, designation, vehicleno, login_id],
        (err, result) => {
            if (!err) {
                res.send("1");
            } else {
                res.send("-1");
            }
        }
    );
});

router.get("/trip_description", (req, res) => {
    let cities;
    let drivers;
    let final = {};
    connection.query("SELECT * FROM delivery_system", (err, result) => {
        if (!err) {
            drivers = result.rows;
            final.vehicle = drivers;
        } else {
            res.send("-1");
            console.log(err);
        }
    });
    connection1.query("SELECT * FROM places", (err, result) => {
        if (!err) {
            cities = result.rows;
            final.cities = cities;
            res.send(final);
        } else {
            res.send("-1");
            console.log(err);
        }
    });
});

router.post("/trip_details", (req, res) => {
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

router.post("/locations", (req, res) => {
    let {order_id, latitude, longitude} = req.body;

    connection.query(
        "INSERT INTO locations (order_id,	latitude, longitude, timest) VALUES ($1,$2,$3,$4)",
        [
            order_id,
            latitude,
            longitude,
            moment.utc().format("YYYY-MM-DD hh:mm:ss +0530"),
        ],
        (err, result) => {
            if (!err) {
                res.send("1");
            } else {
                console.log(err);
                res.send("-1");
            }
        }
    );
});

// router.get("/order", (req, res) => {
//   let delivery_id = req.body.id;
//   connection.query(
//     "SELECT * FROM orders WHERE delivery_id = $1",
//     [delivery_id],
//     (err, result) => {
//       if (!err) {
//         res.send(result.rows[0]);
//       } else {
//         res.send("-1");
//       }
//     }
//   );
// });

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
