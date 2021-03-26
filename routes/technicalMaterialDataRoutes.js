const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const dataModel = require("../models/technical_material");
const { json } = require("body-parser");
const { validationResult } = require("express-validator");
const jsonParser = bodyParser.json();
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const data = await dataModel.find();
    return res.status(200).json(data);
  } catch (err) {
    console.log("error found " + err);
    res.status(404).json({ errors: errors.array() });
  }
});
router.post("/", auth , async (req, res) => {
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
    console.log(req.body);
    const newData = new dataModel({
      title: req.body.title,
      about: req.body.about,
      youtubelink: req.body.youtubelink,
      materialfile : myFile.name,
      uploadedby: req.user.id,
    });
    await newData.save();
    return res.status(200).json(newData);
  } catch (err) {
    console.log(err);
    return res.status(500).end(err);
  }
});
router.get("/getvalues", jsonParser, async (req, res) => {
  console.log(req.body);
  try {
    const material = await dataModel.find({ _id: req.body._id });
    if (!material) {
      return res.status(404).json({ errors: errors.array() });
    } else {
      return res.status(200).json(material);
    }
  } catch (err) {
    res.status(404).json({ errors: errors.array() });
    console.log(err);
  }
});
router.patch("/:id", async (req, res) => {
  try {
    const material = await dataModel.findOne({ _id: req.params._id });
    title = req.body.title;
    date = req.body.date;
    text = req.body.text;
    youtube_link = req.body.youtube_link;
    material_type = req.body.material_type;
    uploadedby = req.body._id;
    file = path.join(__dirname, "../uploads/") + req.file.originalname;
    await material.save();
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
