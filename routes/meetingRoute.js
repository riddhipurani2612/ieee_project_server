const express = require("express");
const { request } = require("http");
const router = express.Router();
const bodyParser = require("body-parser");
const dataModel = require("../models/meeting");
const { json } = require("body-parser");
const fileUpload = require("express-fileupload");
router.get("/", async (req, res) => {
  try {
    const data = await dataModel.find();
    return res.status(200).json(data);
  } catch (err) {
    console.log("error found " + err);
    res.status(404).json({ errors: errors.array() });
  }
});
router.post("/", async (req, res) => {
  if (!req.files) return res.status(500).send({ msg: "File not Found" });
  const myFile = req.files.file;
  console.log(myFile);
  console.log(__dirname);
  try {
    myFile.mv(`./public/${myFile.name}`, function (err) {
      if (err) {
        console.log(err);
        return res.status(500).send({ msg: "Error Occured" });
      }
      return res
        .status(200)
        .send({ name: myFile.name, path: `/${myFile.name}` });
    });
  } catch (error) {
    console.log(error);
  }
  try {
    console.log(req);
    const newData = new dataModel({
      date: req.body.date,
      place: req.body.place,
      attendees: req.body.attendees,
      summary: req.body.summary,
      purpose: req.body.purpose,
      minutes: req.body.minutes,
      sign: myFile.name,
    });
    await newData.save();
    return res.status(200).json(newData);
  } catch (err) {
    res.status(500).end(error);
    console.log(err);
  }
});
module.exports = router;
