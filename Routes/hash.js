const express = require('express');
const crypto = require('crypto');

const router = express.Router();

router.get('/:id/:quant', (req, res) => {
    var input = (req.params.id.toString() + req.params.quant.toString(2));
    hashQr   = crypto.createHash('sha1')
    .update(input)
    .digest('hex');
    res.render();
});

module.exports = router;