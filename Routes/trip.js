// rename this route to register or modularize this
const express = require("express");
const connection = require("../connection");
const { ensureAuthenticated } = require("../config/auth");
const moment = require("moment");
const opencage = require("opencage-api-client");

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

router.get("/order", (req, res) => {
  let cities = [];
  let products;
  let deliver = [];
  connection.query(
    "SELECT id, area, city, state FROM places",
    (err, result) => {
      if (!err) {
        result.rows.forEach((element) => {
          cities.push(element);
        });
        connection.query("SELECT id, name FROM products", (err, result) => {
          if (!err) {
            products = result.rows;
            connection.query(
              "SELECT id, vehicle_no FROM delivery_system",
              (err, result, fields) => {
                if (!err) {
                  result.rows.forEach((element) => {
                    deliver.push(element);
                  });
                  res.render("trip", {
                    layout: "dashboard",
                    cities,
                    products,
                    deliver,
                  });
                } else {
                  console.log(err);
                  res.sendStatus(500);
                }
              }
            );
          } else {
            console.log(err);
            res.sendStatus(500);
          }
        });
      } else {
        console.log(err);
        res.sendStatus(500);
      }
    }
  );
});
router.post("/order", (req, res) => {
  let source_id = req.body.source_id;
  let destination_id = req.body.destination_id;
  let product_id = req.body.product_id;
  let delivery_id = req.body.delivery_id;

  function getAddress(id) {
    connection.query(
      "SELECT * FROM places WHERE id = $1",
      [id],
      (err, result) => {
        if (!err) {
          let address = "";
          address.concat(
            result.rows[0].area,
            " , ",
            result.rows[0].city,
            " , ",
            result.rows[0].state,
            " , ",
            result.rows[0].country,
            " , ",
            result.rows[0].pincode
          );
          return address;
        } else {
          console.log("error getting Address Details: ");
          console.log(err);
        }
      }
    );
  }

  function insertLatlang(source, order_id) {
    opencage
      .geocode({ q: source })
      .then((data) => {
        if (data.status.code == 200) {
          if (data.results.length > 0) {
            var place = data.results[0];
            // console.log(place.formatted);
            // console.log(place.geometry);
            // console.log(place.annotations.timezone.name);
            a.lat = place.geometry.lat;
            a.lng = place.geometry.lng;
            console.log(a);
            latitude = a.lat;
            longitude = a.lng;
            connection.query(
              "INSERT INTO locations (latitude, longitude, order_id, timest)",
              [
                latitude,
                longitude,
                order_id,
                moment.utc().format("YYYY-MM-DD hh:mm:ss +0530"),
              ],
              (err, result) => {
                if (!err) {
                  console.log(place.geometry);
                } else {
                  console.log("error getting Address Details: ");
                  console.log(err);
                }
              }
            );
          }
        } else if (data.status.code == 402) {
          console.log("hit free-trial daily limit");
          console.log("become a customer: https://opencagedata.com/pricing");
        } else {
          // other possible response codes:
          // https://opencagedata.com/api#codes
          console.log("error", data.status.message);
        }
      })
      .catch((error) => {
        console.log("geocode query error");
        console.log("error", error.message);
      });
  }

  connection.query(
    "INSERT INTO orders (source_id,	destination_id, product_id, delivery_id,timest ) VALUES ($1,$2,$3,$4, now())",
    [source_id, destination_id, product_id, delivery_id],
    (err, result) => {
      if (!err) {
        connection.query(
          "SELECT id FROM orders where source_id = $1 and destination_id = $2 and product_id = $3 and delivery_id = $4",
          [source_id, destination_id, product_id, delivery_id],
          (err, result1) => {
            if (!err) {
              let source = getAddress(source_id);
              let dest = getAddress(destination_id);
              insertLatlang(source, result1.rows[0].id);
              insertLatlang(dest, result1.rows[0].id);
              res.redirect("/dashboard");
            } else {
              console.log(err);
              res.sendStatus(500);
            }
          }
        );
      } else {
        console.log(err);
        res.send("0");
      }
    }
  );
});

router.get("/deliver", (req, res) => {
  res.render("delivery", { layout: "dashboard" });
});
//deliver route after session implimentation add login id
router.post("/deliver", (req, res) => {
  let name = req.body.name;
  let designation = req.body.designation;
  let vehicleno = req.body.vehicleno;
  //let login_id = req.user.id; // imp

  connection.query(
    "INSERT INTO delivery_system (name, designation, vehicle_no ) VALUES ($1,$2,$3)",
    [name, designation, vehicleno],
    (err, result) => {
      if (!err) {
        res.redirect("/dashboard");
      } else {
        console.log(err);
        res.send(err);
      }
    }
  );
});

router.get("/places", (req, res) => {
  res.render("places", { layout: "dashboard" });
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
        res.redirect("/dashboard"); //must be redirected to dashboard
      } else {
        console.log(err);
        res.sendStatus(500);
      }
    }
  );
});

router.get("/product", (req, res) => {
  res.render("product", { layout: "dashboard" });
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
        res.redirect("/dashboard");
      } else {
        console.log(err);
        res.send("0");
      }
    }
  );
});
router.get("/driverregistration", (req, res) => {
  res.render("driverregistration", { layout: "dashboard" });
});

router.get("/latlong", (req, res) => {
  function getAddress(id) {
    connection.query(
      "SELECT * FROM places WHERE id = $1",
      [id],
      (err, result) => {
        if (!err) {
          console.log(result.rows[0]);
          return result.rows[0];
        } else {
          console.log("error getting Address Details: ");
          console.log(err);
        }
      }
    );
  }

  function getLatlang(source, order_id) {
    geocoder.geocode(source, (err, data) => {
      if (!err) {
        // let { latitude, longitude } = data[0];
        console.log(data);
        return data[0];
        // connection.query(
        //   "INSERT INTO locations (latitude, longitude, order_id, timest)",
        //   [
        //     latitude,
        //     longitude,
        //     order_id,
        //     moment.utc().format("YYYY-MM-DD hh:mm:ss +0530"),
        //   ],
        //   (err, result) => {
        //     if (!err) {
        //       return result.rows[0];
        //     } else {
        //       console.log("error getting Address Details: ");
        //       console.log(err);
        //     }
        //   }
        // );
      } else {
        console.log("error in fetching geocodes");
        console.log(err);
      }
    });
  }

  // let addr = getAddress(9);
  // let source = "";
  // source.concat(addr.area, " ", addr.city, " ", addr.state, " ", addr.pincode);
  let result = getLatlang("29 champs elysée paris", 15);
});

router.get("/getCoordinates", (req, res) => {
  var a = {};
  var latitude;
  opencage
    .geocode({ q: "g h raisoni collge of engineering, nagpur, india" })
    .then((data) => {
      if (data.status.code == 200) {
        if (data.results.length > 0) {
          var place = data.results[0];
          // console.log(place.formatted);
          // console.log(place.geometry);
          // console.log(place.annotations.timezone.name);
          console.log("yeh sahi hai kya");

          a.lat = place.geometry.lat;
          a.lng = place.geometry.lng;
          console.log(a);
          latitude = a.lat + "";
          longitude = a.lng;
          res.send('{"lat":' + latitude + ',"lng":' + longitude + "}");
        }
      } else if (data.status.code == 402) {
        console.log("hit free-trial daily limit");
        console.log("become a customer: https://opencagedata.com/pricing");
      } else {
        // other possible response codes:
        // https://opencagedata.com/api#codes
        console.log("error", data.status.message);
      }
    })
    .catch((error) => {
      console.log("error", error.message);
    });

  // ... prints
  // Theresienhöhe 11, 80339 Munich, Germany
  // { lat: 48.1341651, lng: 11.5464794 }
  // Europe/Berlin
});
module.exports = router;
