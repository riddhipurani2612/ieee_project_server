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
router.get("/:id", async (req, res) => {
  try {
    const data = await dataModel.findById(req.params.id);
    return res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ errors: err.array() });
  }
});
router.post("/", async (req, res) => {
  let newFileName;
  if (req.files) {
    const myFile = req.files.file;
    console.log(myFile);
    console.log(__dirname);
    newFileName = myFile.name.split(" ").join("_");
    try {
      myFile.mv(`./public/${newFileName}`, function (err) {
        if (err) {
          console.log(err);
          return res.status(500).send({ msg: "Error Occured" });
        }
        return res
          .status(200)
          .send({ name: newFileName, path: `/${newFileName}` });
      });
    } catch (error) {
      console.log(error);
    }
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
      sign: newFileName,
    });
    await newData.save();
    return res.status(200).json(newData);
  } catch (err) {
    res.status(500).end(error);
    console.log(err);
  }
});

router.delete("/:_id", async (req, res) => {
  try {
    console.log(`Delete : ${req.params._id}`);
    const meeting = dataModel.findById(req.params._id).deleteOne().exec();
    console.log(meeting);
    res.status(200).send("Deleted");
  } catch (err) {
    console.log(err);
    res.status(404).send({ msg: "Data Not found" });
  }
});

router.patch("/:_id", async (req, res) => {
  if (req.files) {
    try {
      console.log("file");
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
      const newFileName = myFile.name.split(" ").join("_");
      const meetingObj = await dataModel.findById(req.params._id);
      meetingObj.date = req.body.date;
      meetingObj.place = req.body.place;
      meetingObj.attendees = req.body.attendees;
      meetingObj.summary = req.body.summary;
      meetingObj.purpose = req.body.purpose;
      meetingObj.minutes = req.body.minutes;
      meetingObj.sign =  newFileName;  
      await meetingObj.save();
      console.log(meetingObj);
      return res.status(200).json(meetingObj);
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      const meetingObj = await dataModel.findById(req.params._id);
      meetingObj.date = req.body.date; 
      meetingObj.place = req.body.place;
      meetingObj.attendees = req.body.attendees;
      meetingObj.summary = req.body.summary;
      meetingObj.purpose = req.body.purpose;
      meetingObj.minutes = req.body.minutes;
      meetingObj.sign =  newFileName;  
      await meetingObj.save();
      console.log(meetingObj);
      return res.status(200).json(meetingObj);
    } catch (err) {
      console.log(err);
    }
  }
});
module.exports = router;