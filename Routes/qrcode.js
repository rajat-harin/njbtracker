const express = require("express");
const qrcode = require("qrcode");
const url = require("url");
const connection = require("../connection");
const { ensureAuthenticated } = require("../config/auth");

const router = express.Router();

router.get("/", ensureAuthenticated, (req, res) => {
  qrcode.toDataURL(req.user.name, { errorCorrectionLevel: "H" }, (err, url) => {
    if (!err) {
      code = url;
      res.render("code", { code });
    } else {
      console.log("error generating code!");
      res.sendStatus(500);
    }
  });
});

router.post("/", ensureAuthenticated, (req, res) => {
  let orderId = req.body.id;
  let urlpart = url.parse(req.url, true);
  let urlhost = urlpart.host;
  let link = urlhost;
  link = link.concat("/qrcode/");
  connection.query(
    "SELECT * FROM orders WHERE id = $1",
    [orderId],
    (err, result) => {
      if (!err) {
        link = link.concat(result.rows[0].product_id);

        qrcode.toDataURL(link, { errorCorrectionLevel: "H" }, (err, url) => {
          if (!err) {
            code = url;
            res.send(code);
          } else {
            console.log("error generating code!");
            res.sendStatus(500);
          }
        });
      } else {
      }
    }
  );
});

router.get("/:id", ensureAuthenticated, (req, res) => {
  let orderId = req.body.id;
  let urlpart = url.parse(req.url, true);
  let urlhost = urlpart.host;
  let link = urlhost;
  link = link.concat("/qrcode/");
  connection.query(
    "SELECT * FROM orders WHERE id = $1",
    [orderId],
    (err, result) => {
      if (!err) {
        link = link.concat(result.rows[0].product_id);

        qrcode.toDataURL(link, { errorCorrectionLevel: "H" }, (err, url) => {
          if (!err) {
            code = url;
            res.render("code", { code });
          } else {
            console.log("error generating code!");
            res.sendStatus(500);
          }
        });
      } else {
      }
    }
  );
});

module.exports = router;
