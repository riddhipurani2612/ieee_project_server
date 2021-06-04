const express = require("express");
const { request } = require("http");
const router = express.Router();
const bodyParser = require("body-parser");
const dataModel = require("../models/event");
const { json } = require("body-parser");
const jsonParser = bodyParser.json();

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
      eventname: req.body.eventname,
      date: req.body.date,
      text: req.body.text,
      about: req.body.about,
      time: req.body.time,
      hostedby: req.body.hostedby,
      registrationlink: req.body.registrationlink,
      eventimage: myFile.name,
    });
    await newData.save();
    return res.status(200).json(newData);
  } catch (err) {
    console.log(err);
  }
});
router.get("/get/:_id", jsonParser, async (req, res) => {
  try {
    console.log("get id");
    const event = await dataModel.findById(req.params._id);
    if (event) {
      console.log(event);
      return res.status(200).json(event);
    } else {
      return res.status(404).send("Data Not Found");
    }
  } catch (err) {}
});
router.get("/", jsonParser, async (req, res) => {
  console.log(req.body);
  try {
    const event = await dataModel.find();
    if (!event) {
      res.status(404).send("Events not Found");
    } else {
      return res.status(200).json(event);
    }
  } catch (err) {
    res.status(404).send("Events not Found");
    console.log(err);
  }
});
router.get("/upcoming", jsonParser, async (req, res) => {
  try {
    const event = await dataModel.find({ date: { $gte: new Date() } });
    if (!event) {
      res.status(404).send("Events not Found");
    } else {
      return res.status(200).json(event);
    }
  } catch (err) {
    res.status(404).send("Events not Found");
    console.log(err);
  }
});
router.get("/passed", jsonParser, async (req, res) => {
  console.log(req.body);
  try {
    var d = new Date(),
      hour = d.getHours(),
      min = d.getMinutes(),
      month = d.getMonth(),
      year = d.getFullYear(),
      sec = d.getSeconds(),
      day = d.getDate();
    const event = await dataModel.find({
      date: {
        $lt: new Date(),
        $gte: new Date(year - 1 + "-" + month + "-" + day),
      },
    });
    if (!event) {
      res.status(404).send("Events not Found");
    } else {
      return res.status(200).json(event);
    }
  } catch (err) {
    res.status(404).send("Events not Found");
    console.log(err);
  }
});
router.patch("/:_id", async (req, res) => {
  try {
    let file;
    console.log(req.body);
    const event = await dataModel.findById(req.params._id);
    if (req.files) {
      const myFile = req.files.file;
      console.log(myFile);
      console.log(__dirname);
      try {
        myFile.mv(`./public/${myFile.name}`, async function (err) {
          if (err) {
            return res.status(400).send("File Uploading Error");
          } else {
            file = myFile.name;
            event.eventname = req.body.eventname;
            event.about = req.body.about;
            event.registrationlink = req.body.registrationlink;
            event.date = req.body.date;
            event.eventimage = file;
            event.hostedby = req.body.hostedby;
            await event.save();
            return res.status(200).json(event);
          }
        });
      } catch (error) {
        return res.status(400).send({ message: "Data not updated" });
      }
    } else {
      console.log("else");
      file = req.body.eventimage;
      console.log(req.body);

      try {
        event.eventname = req.body.eventname;
        event.about = req.body.about;
        event.registrationlink = req.body.registrationlink;
        event.date = req.body.date;
        event.eventimage = req.body.file;
        event.hostedby = req.body.hostedby;
        await event.save();
        return res.status(200).json(event);
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
});
router.delete("/:_id", async (req, res) => {
  try {
    console.log(`Delete : ${req.params._id}`);
    const event = dataModel.findById(req.params._id).deleteOne().exec();
    console.log(event);
    res.status(200).send("Deleted");
  } catch (err) {
    console.log(err);
    res.status(404).send({ msg: "Data Not found" });
  }
});
module.exports = router;
