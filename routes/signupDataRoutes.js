const express= require("express");
const { request } = require("http");
const router = express.Router();
const bodyParser = require("body-parser");
const dataModel = require("../models/user_signup");
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
            first_name : req.body.first_name,
            last_name : req.body.last_name,
            role : req.body.role,
            address : req.body.address,
            contactno : req.body.contactno,
            profileimage : req.body.profileimage,
            email : req.body.email,
            work_place : req.body.work_place,
            designation : req.body.designation,
            work_details : req.body.work_details
        });
        await newData.save();
        res.send("Signup");
    }
    catch(err){
        console.log(err);
    }
});
module.exports = router;