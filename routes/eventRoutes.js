const express= require("express");
const { request } = require("http");
const router = express.Router();
const bodyParser = require("body-parser");
const dataModel = require("../models/event");
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
            name : req.body.name,
            date : req.body.date,
            text : req.body.text,
            image : req.body.image,
            material_type : req.body.material_type,
            _id : req.body._id
        });
        await newData.save();
        res.send("Event Added");
    }
    catch(err){
        console.log(err);
    }
});
module.exports = router;