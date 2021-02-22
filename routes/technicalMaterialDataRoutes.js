const express= require("express");
const { request } = require("http");
const router = express.Router();
const bodyParser = require("body-parser");
const dataModel = require("../models/technical_material");
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
            title : req.body.title,
            date : req.body.date,
            text : req.body.text,
            youtube_link : req.body.youtube_link,
            material_type : req.body.material_type,
            _id : req.body._id
        });
        await newData.save();
        res.send("Material Added");
    }
    catch(err){
        console.log(err);
    }
});
module.exports = router;