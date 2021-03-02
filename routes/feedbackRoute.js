const express = require("express");
const { request } = require("http");
const router = express.Router();
const bodyParser = require("body-parser");
const dataModel = require("../models/feedback");
const { json } = require("body-parser");
const jsonParser = bodyParser.json();
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
      name: req.body.name,
      email: req.body.email,
      contact: req.body.contact,
      address: req.body.address,
      subject: req.body.subject,
      message: req.body.message,
    });
    await newData.save();
    return res.status(200).json(newData);
  } catch (err) {
    res.status(500).end(error);
    console.log(err);
  }
});
module.exports = router;