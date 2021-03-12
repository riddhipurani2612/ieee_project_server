const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const dataModel = require("../models/technical_material");
const { json } = require("body-parser");
const { validationResult } = require("express-validator");
const jsonParser = bodyParser.json();
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const DIR = "./public/";
const storage = multer.diskStorage({
  destination : (req, file, cb) =>{
    const filename = file.originalname.toLowerCase().split(" ").join("-");
    cb(null,uuidv4()+'-'+filename);
  }
});
router.get("/", async (req, res) => {
  try {
    const data = await dataModel.find();
    return res.status(200).json(data);
  } catch (err) {
    console.log("error found " + err);
    res.status(404).json({errors : errors.array()});
  }
});
router.post("/", jsonParser, async (req, res) => {
  try {
    console.log(req);
    const newData = new dataModel({
      title: req.body.title,
      date: req.body.date,
      text: req.body.text,
      youtube_link: req.body.youtube_link,
      material_type: req.body.material_type,
      uploadedby: req.body._id,
    });
    await newData.save();
    return res.status(200).json(newData);
  } catch (err) {
    console.log(err);
    res.status(500).end(err);
  }
});
router.get("/getvalues", jsonParser, async (req, res) => {
    console.log(req.body);
    try{
        const material = await dataModel.find({ _id: req.body._id });
        if (!material) {
          return res.status(404).json({errors : errors.array()});
        } else {
          return res.status(200).json(material);
        }    
    }
    catch(err){
        res.status(404).json({errors : errors.array()});
        console.log(err);
    }
  });
router.patch("/", async (req, res) => {
  try {
    const material = await dataModel.findOne({ _id: req.body._id });
    title = req.body.title;
    date = req.body.date;
    text = req.body.text;
    youtube_link = req.body.youtube_link;
    material_type = req.body.material_type;
    uploadedby = req.body._id;
    await material.save();
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
