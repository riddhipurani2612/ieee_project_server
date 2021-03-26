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
      const data = await dataModel.findById(req.body._id);
      console.log(data.password);
      const isMatch = await bcrypt.compare(req.body.password, data.password);
      console.log(isMatch);
      if (isMatch) {
        const hashedPassword = await bcrypt.hash(req.body.newpassword, 12);
        data.first_name = data.first_name;
        data.last_name = data.last_name;
        data.role = data.role;
        data.address = data.address;
        data.email = data.email;
        data.contact = data.contact;
        data.workplace = data.workplace;
        data.designation = data.designation;
        data.password = hashedPassword;
        data.subscription = data.subscription;
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
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      console.log(req.body);
      const hashedPassword = await bcrypt.hash(req.body.password, 12);
      const user = new dataModel({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        role: req.body.role,
        address: req.body.address,
        contact: req.body.contact,
        email: req.body.email,
        workplace: req.body.workplace,
        designation: req.body.designation,
        password: hashedPassword,
        subscription: req.body.subscription,
        about : req.body.about,
      });
      console.log(user);
      await user.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(404).json(err);
      console.log("error : " + err);
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
    const data = await dataModel.find({role:req.params.role});
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
        const roleUser=user.role;
        if (isMatch) {
          const payload={
            user : {
              id : user._id,
              first_name : user.first_name,
              last_name : user.last_name,
              role : user.role,
            },
          };
          jwt.sign(
            payload,
            config.get("secretKey"),
            (err,token) =>{
              if(err) throw err;
              console.log(token);
              console.log(roleUser);
              return res.json({token, roleUser});
            }
          )
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
router.get("/",auth ,async (req, res) => {
  try {
    console.log(req.user.id);
    const data = await dataModel.findById(req.user.id);
    res.json(data);
  } catch (err) {
    res.send(err);
  }
});
router.get("/getrole",auth,async(req,res) =>{
  try{
    console.log(req.user.id);
    const data = await dataModel.findById(req.user.id);
    console.log(data.role);
    return res.status(200).json(data.role);
  }
  catch(err){
    res.status(404).send({msg : "User Not Found"});
  }
});

router.patch(
  "/:_id",
  [
    [
      check("_id", "ID is required").not().isEmpty(),
      check("first_name", "First name is required").not().isEmpty(),
      check("last_name", "Last name is required").not().isEmpty(),
      check("role", "Role is required").not().isEmpty(),
      check("address", "Address is required").not().isEmpty(),
      check("email", "Email is required").not().isEmpty(),
      check("email", "Not a valid email id").isEmail(),
      check("workplace", "Workplace is required").not().isEmpty(),
      check("designation", "Designation is required").not().isEmpty(),
      check("password", "Password is required").not().isEmpty(),
      check("password", "Password length should be more than 8").isLength({
        min: 8,
      }),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const user = await dataModel.findOne({ _id: req.params._id });
      user.first_name = req.body.first_name;
      user.last_name = req.body.last_name;
      user.address = req.body.address;
      user.email = req.body.email;
      user.contact = req.body.contact;
      user.workplace = req.body.workplace;
      user.designation = req.body.designation;
      await user.save();
      console.log(user);
      return res.status(200).json(user);
    } catch (err) {
      console.log(err);
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
