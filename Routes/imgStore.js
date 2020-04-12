const express = require('express');
const tripSchema = require('../models/trip.model')

const router = express.Router();

router.get('/', (req,res)=>{
    tripSchema.find((err, docs)=>{
        if(!err)
        {
            //console.log(docs);
            
            res.send(docs);
        }
        else{
            console.log('err');
            
        }

    });
});

router.get('/:name', (req,res)=>{
    tripSchema.findOne(
        {
            $or: [
                   { tripName : req.params.name },
                 ]
        },
        (err, docs)=>{
        if(!err)
        {
            //console.log(docs);
            
            res.send(docs.image);
        }
        else{
            console.log('err');
            
        }

    });
});

router.post('/', (req, res) => {
    let trip = new tripSchema();
    trip.tripName = req.body.name;
    trip.image = req.body.image;
   
    trip.save((err, docs)=>{
        if(!err){
            res.status(200).send('Success');
        }
        else{
            res.status(500).send(err);
        }

    });
});

module.exports = router;