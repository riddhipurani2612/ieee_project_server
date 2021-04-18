const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const bodyParser = require("body-parser");
const { json } = require("body-parser");
const jsonParser = bodyParser.json();
const dataModel = require("../models/user");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");

router.post(
  "/changepassword",
  auth,
  [
    check("password", "Password is required").not().isEmpty(),
    check("password", "Password length should be more than 8").isLength({
      min: 8,
    }),
    check("newpassword", "Password is required").not().isEmpty(),
    check("newpassword", "Password length should be more than 8").isLength({
      min: 8,
    }),
    check("_id", "Id is required").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      console.log(req.body);
      const data = await dataModel.findById(req.user._id);
      console.log(data.password);
      const isMatch = await bcrypt.compare(req.body.password, data.password);
      console.log(isMatch);
      if (isMatch) {
        const hashedPassword = await bcrypt.hash(req.body.newpassword, 12);
        data.first_name = data.first_name;
        data.last_name = data.last_name;
        data.role = data.role;
        data.email = data.email;
        data.contact = data.contact;
        data.workplace = data.workplace;
        data.designation = data.designation;
        data.password = hashedPassword;
        data.about=data.about;
        data.profile = profile;
        await data.save();
        console.log(data);
        return res.status(200).json(data);
      } else {
        return res
          .status(400)
          .json({ errors: [{ msg: "invalid credentials" }] });
      }
    } catch (err) {
      res.status(404).json(err);
    }
  }
);
router.post(
  "/",
  [
    check("first_name", "First name is required").not().isEmpty(),
    check("last_name", "Last name is required").not().isEmpty(),
    check("role", "Role is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty(),
    check("email", "Not a valid email id").isEmail(),
    check("workplace", "Workplace is required").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
    check("password", "Password length should be more than 8").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    const userFound = await dataModel.findOne({ email: req.body.email });
    if (userFound) {
      return res.status(409).send({ msg: "User Already Exists.." });
    }
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
        const profileNew = "http://localhost:5000/" + myFile.name;
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        console.log(req.body);
        const newData = new dataModel({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          role: req.body.role,
          contact: req.body.contact,
          email: req.body.email,
          workplace: req.body.workplace,
          designation: req.body.designation,
          password: hashedPassword,
          profile: profileNew,
          about: req.body.about,
        });
        await newData.save();
        return res.status(200).json(newData);
      } catch (err) {
        console.log(err);
        return res.status(500).end(err);
      }
    } else {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        console.log(req.body);
        const newData = new dataModel({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          role: req.body.role,
          contact: req.body.contact,
          email: req.body.email,
          workplace: req.body.workplace,
          designation: req.body.designation,
          password: hashedPassword,
          subscription: req.body.subscription,
          about: req.body.about,
          profile : "http://localhost:5000/default.png"
        });
        await newData.save();
        return res.status(200).json(newData);
      } catch (err) {
        console.log(err);
        return res.status(500).end(err);
      }
    }
  }
);
router.get("/view", async (req, res) => {
  try {
    const data = await dataModel.find();
    res.json(data);
  } catch (err) {
    res.status(404).end("Error " + err);
  }
});
router.get("/getmembers/:role", async (req, res) => {
  try {
    console.log("Members");
    console.log(req.body);
    const data = await dataModel.find({ role: req.params.role }).select("-_id");
    console.log(data);
    res.json(data);
  } catch (err) {
    res.status(404).end("Error " + err);
  }
});
router.put(
  "/",
  [
    check("email", "Email is required").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      console.log(req.body);
      const user = await dataModel.findOne({ email: req.body.email });
      if (!user) {
        res.status(404).json({ errors: errors.array() });
      } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        const roleUser = user.role;
        if (isMatch) {
          const payload = {
            user: {
              _id: user._id,
              first_name: user.first_name,
              last_name: user.last_name,
              role: user.role,
            },
          };
          jwt.sign(payload, config.get("secretKey"), (err, token) => {
            if (err) throw err;
            console.log(token);
            console.log(roleUser);
            return res.json({ token, roleUser });
          });
        } else {
          console.log("INvalid");
          return res.status(404).json({ errors: errors.array() });
        }
      }
    } catch (err) {
      console.log("error : " + err);
    }
  }
);
router.get("/", auth, async (req, res) => {
  try {
    console.log(req.user._id);
    const data = await dataModel.findById(req.user._id).select("-_id -password");
    res.json(data);
  } catch (err) {
    res.send(err);
  }
});
router.get("/getrole", auth, async (req, res) => {
  try {
    console.log(req.user);
    const data = await dataModel
      .findById(req.user._id)
      .select("first_name last_name role profile -_id");
    return res.status(200).json(data);
  } catch (err) {
    res.status(404).send({ msg: "User Not Found" });
  }
});

router.patch(
  "/",
  auth,
  [
    [
      check("first_name", "First name is required").not().isEmpty(),
      check("last_name", "Last name is required").not().isEmpty(),
      check("role", "Role is required").not().isEmpty(),
      check("email", "Email is required").not().isEmpty(),
      check("email", "Not a valid email id").isEmail(),
      check("workplace", "Workplace is required").not().isEmpty(),
      check("designation", "Designation is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
        const profileNew = "http://localhost:5000/"+myFile.name;
        console.log(profileNew);
        const updatedUser = await dataModel.findById(req.user._id );
        updatedUser.first_name = req.body.first_name;
        updatedUser.last_name = req.body.last_name;
        updatedUser.email = req.body.email;
        updatedUser.contact = req.body.contact;
        updatedUser.workplace = req.body.workplace;
        updatedUser.designation = req.body.designation;
        updatedUser.about = req.body.about;
        updatedUser.profile = profileNew;
        await updatedUser.save();
        console.log(updatedUser);
        return res.status(200).json(updatedUser);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
        console.log(req.user.id);
        console.log(req.user);
        const updatedUser = await dataModel.findById(req.user._id);
        updatedUser.first_name = req.user.first_name;
        updatedUser.last_name = req.user.last_name;
        updatedUser.email = req.body.email;
        updatedUser.contact = req.body.contact;
        updatedUser.workplace = req.body.workplace;
        updatedUser.designation = req.body.designation;
        updatedUser.profile = req.body.profile;
        updatedUser.about = req.body.about;
        await updatedUser.save();
        console.log(updatedUser);
        return res.status(200).json(updatedUser);
      } catch (err) {
        console.log(err);
      }
    }
  }
);
router.delete("/delete", jsonParser, async (req, res) => {
  try {
    console.log(req.body);
    const user = await dataModel.deleteOne({ _id: req.body._id });
    console.log("Data : " + user);
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
