const express= require("express");
const { request } = require("http");
const router = express.Router();
const bodyParser = require("body-parser");
const dataModel = require("../models/registration_user");
const { json } = require("body-parser");
const jsonParser = bodyParser.json();
router.get("/", async (req, res) => {
    try {
        const data = await dataModel.find();
        res.json(data);
    } catch (err) {
        console.log("error found " + err);
    }
});
router.post("/",jsonParser, async (req,res) =>{
    try{
        console.log(req);
        const newData = new dataModel({
            date : req.body.date,
            amount : req.body.amount,
            _id : req.body._id
        });
        await newData.save();
        res.send("Registered");
    }
    catch(err){
        console.log(err);
    }
});
module.exports = router;