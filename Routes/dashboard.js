const express = require("express");
const { ensureAuthenticated } = require("../config/auth");
const connection = require("../connection");
const router = express.Router();

router.get("/", ensureAuthenticated, (req, res) => {
  res.render("index", { layout: "dashboard" });
});

router.get("/charts", ensureAuthenticated, (req, res) => {
  res.render("charts", { layout: false });
});

router.get("/trips", ensureAuthenticated, (req, res) => {
  let cities = [];
  let orders = [];
  function searchId(id, myArray) {
    for (let index = 0; index < myArray.length; index++) {
      if (myArray[index].id == id) {
        return myArray[index].city;
      }
    }
  }
  function replaceId(myArray, refArray) {
    myArray.forEach((element) => {
      element.source_id = searchId(element.source_id, refArray);
      element.destination_id = searchId(element.destination_id, refArray);
    });
    return myArray;
  }

  connection.query("SELECT * FROM orders", (err, result) => {
    if (!err) {
      orders = result.rows;
      connection.query("SELECT id, city FROM places", (err, result) => {
        if (!err) {
          result.rows.forEach((element) => {
            cities.push(element);
          });
          orders = replaceId(orders, cities);
          console.log(orders);
          res.render("tripData", { layout: "dashboard", cities, orders });
        } else {
          console.log(err);
        }
      });
    } else {
      res.send("Error Fetching Trips");
    }
  });
});

router.get("/drivers", ensureAuthenticated, (req, res) => {
  let drivers = [];
  connection.query("SELECT * FROM delivery_system", (err, result) => {
    if (!err) {
      drivers = result.rows;
      res.render("driversData", { layout: "dashboard", drivers });
    } else {
      res.send("Error Fetching Trips");
    }
  });
});

router.get("/data", ensureAuthenticated, (req, res) => {
  var data = {
    cols: [
      { id: "", label: "Topping", pattern: "", type: "string" },
      { id: "", label: "Slices", pattern: "", type: "number" },
    ],
    rows: [
      {
        c: [
          { v: "Mushrooms", f: null },
          { v: 3, f: null },
        ],
      },
      {
        c: [
          { v: "Onions", f: null },
          { v: 1, f: null },
        ],
      },
      {
        c: [
          { v: "Olives", f: null },
          { v: 1, f: null },
        ],
      },
      {
        c: [
          { v: "Zucchini", f: null },
          { v: 1, f: null },
        ],
      },
      {
        c: [
          { v: "Pepperoni", f: null },
          { v: 2, f: null },
        ],
      },
    ],
  };
  res.send(data);
});

module.exports = router;
