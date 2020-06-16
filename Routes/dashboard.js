const express = require('express');
const { ensureAuthenticated } = require('../config/auth');
const router = express.Router();

router.get('/', ensureAuthenticated, (req, res) => {
    res.render('index', { layout: 'dashboard' });
});

router.get('/charts', ensureAuthenticated, (req, res) => {
    res.render('charts', { layout: false });
});

router.get('/data', ensureAuthenticated, (req, res) => {
    var data = {
        "cols": [
            { "id": "", "label": "Topping", "pattern": "", "type": "string" },
            { "id": "", "label": "Slices", "pattern": "", "type": "number" }
        ],
        "rows": [
            { "c": [{ "v": "Mushrooms", "f": null }, { "v": 3, "f": null }] },
            { "c": [{ "v": "Onions", "f": null }, { "v": 1, "f": null }] },
            { "c": [{ "v": "Olives", "f": null }, { "v": 1, "f": null }] },
            { "c": [{ "v": "Zucchini", "f": null }, { "v": 1, "f": null }] },
            { "c": [{ "v": "Pepperoni", "f": null }, { "v": 2, "f": null }] }
        ]
    }
    res.send(data);
});


module.exports = router;