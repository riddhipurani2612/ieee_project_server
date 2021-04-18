const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const dataModel = require("../models/technical_material");
const { json } = require("body-parser");
const { validationResult } = require("express-validator");
const jsonParser = bodyParser.json();
const auth = require("../middleware/auth");

router.get("/materials/:materialtype", async (req, res) => {
  try {
    console.log(req.body);
    const data = await dataModel.find({
      materialtype: req.params.materialtype,
    });
    return res.status(200).json(data);
  } catch (err) {
    console.log("error found " + err);
    res.status(404).json({ errors: errors.array() });
  }
});
router.get("/update/:id", async (req, res) => {
  try {
    const data = await dataModal.findById(req.params.id);
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json(err);
  }
});
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
    res.status(404).json({ errors: errors.array() });
  }
});

router.post("/", auth, async (req, res) => {
  console.log(req);
  if (req.files) {
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
        materialtype: req.body.materialtype,
        materialfile: myFile.name,
        uploadedby: req.user.id,
      });
      await newData.save();
      return res.status(200).json(newData);
    } catch (err) {
      console.log(err);
      return res.status(500).end(err);
    }
  } else {
    try {
      console.log(req.body);
      const newData = new dataModel({
        title: req.body.title,
        about: req.body.about,
        youtubelink: req.body.youtubelink,
        materialtype: req.body.materialtype,
        uploadedby: req.user.id,
      });
      await newData.save();
      return res.status(200).json(newData);
    } catch (err) {
      console.log(err);
      return res.status(500).end(err);
    }
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
router.patch("/:id", auth, async (req, res) => {
  try {
    let file;
    const material = await dataModel.findById(req.params.id);
    if (req.files) {
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
        file = "http://localhost:5000/" + myFile;
      } catch (error) {
        console.log(error);
      }
    } else {
      file = req.body.materialfile;
    }

    material.title = req.body.title;
    material.about = req.body.about;
    material.youtubelink = req.body.youtubelink;
    material.materialtype = req.body.materialtype;
    material.materialfile = file;
    material.uploadedby = req.user.id;
    await material.save();
  } catch (err) {
    console.log(err);
  }
});
router.delete("/:_id", async (req, res) => {
  try {
    console.log(`Delete : ${req.params._id}`);
    const material = dataModel.findById(req.params._id).deleteOne().exec();
    console.log(material);
    res.status(200).send("Deleted");
  } catch (err) {
    console.log(err);
    res.status(404).send({ msg: "Data Not found" });
  }
});
module.exports = router;