const express = require('express');
const qrcode = require('qrcode');
const { ensureAuthenticated } = require('../config/auth');

const router = express.Router();

router.get('/', ensureAuthenticated , (req, res) => {
    qrcode.toDataURL(req.user.name,{ errorCorrectionLevel: 'H' }, (err, url)=>{
        if (!err) {
            code = url;
            res.render('code',{code});
        } 
        else {
            console.log('error generating code!');
            res.sendStatus(500);
        }
    });
});

module.exports = router;