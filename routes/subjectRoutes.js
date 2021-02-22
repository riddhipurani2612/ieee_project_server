const express= require("express");
const { request } = require("http");
const router = express.Router();
const bodyParser = require("body-parser");
const dataModel = require("../models/subject");
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
            subject : req.body.subject
        });
        await newData.save();
        res.send("Subject Added");
    }
    catch(err){
        console.log(err);
    }
});
module.exports = router;