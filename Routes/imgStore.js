const express = require("express");
const client = require("../models/mongoCon");

const router = express.Router();

router.get("/", (req, res) => {
  client.connect((err, client) => {
    console.log("Connected correctly to server for img get");
    const db = client.db("Sih");

    // Insert a single document
    db.collection("njb").find((err, docs) => {
      if (!err) {
        console.log(docs);
      } else {
        console.log("err");
      }
    });
  });
});

router.get("/:name", (req, res) => {
  client.connect((err, client) => {
    console.log("Connected correctly to server");
    const db = client.db("Sih");

    // Insert a single document
    db.collection("njb").findOne(
      {
        $or: [{ tripName: req.params.name }],
      },
      (err, docs) => {
        if (!err) {
          //console.log(docs);

          res.send(docs.image);
        } else {
          console.log("err");
        }
      }
    );
  });
});

router.post("/", (req, res) => {
  //   let trip = new tripSchema();
  let tripName = req.body.name;
  let image = req.body.image;
  let d = Date.now();
  client.connect((err, client) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected correctly to server for img post");
      const db = client.db("Sih");

      // Insert a single document
      db.collection("njb").insertOne({ tripName, image, d }, (err, result) => {
        if (err) throw err;
        // client.close();
      });
    }
  });
});

//   trip.save((err, docs) => {
//     if (!err) {
//       res.status(200).send("Success");
//     } else {
//       res.status(500).send(err);
//     }
//   });
// });

module.exports = router;
