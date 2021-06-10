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
const { update } = require("../models/user");
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
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      console.log(req.body);
      const data = await dataModel.findById(req.user._id);
      if (!data) {
        return res.status(422).json({ msg: "User not found" });
      }
      console.log(data.password);
      const isMatch = await bcrypt.compare(req.body.password, data.password);
      console.log(isMatch);
      if (isMatch) {
        const hashedPassword = await bcrypt.hash(req.body.newpassword, 12);
        data.first_name = data.first_name;
        data.last_name = data.last_name;
        data.role = data.role;
        data.email = data.email;
        data.emails = data.emails;
        data.memberid = data.memberid;
        data.contact = data.contact;
        data.workplace = data.workplace;
        data.designation = data.designation;
        data.password = hashedPassword;
        data.about = data.about;
        data.profile = data.profile;
        console.log(data);
        await data.save();
        console.log(data);
        return res.status(200).json(data);
      } else {
        return res.status(422).json({ msg: "invalid credentials" });
      }
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: "Error" });
    }
  }
);
router.post("/send", async (req, res) => {
  const userFound = await dataModel.findOne({ email: req.body.email });
  if (userFound) {
    console.log("User exists");
    return res
      .status(409)
      .json({ msg: "User Already Exists! Use other Email Id to sign up!" });
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    console.log(req.body);
    const newData = new dataModel({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      role: req.body.role,
      contact: req.body.contact,
      memberid: req.body.memberid,
      email: req.body.email,
      founder: req.body.founder,
      workplace: req.body.workplace,
      designation: req.body.designation,
      password: hashedPassword,
      subscription: req.body.subscription,
      about: req.body.about,
      profile: req.body.profile,
    });
    await newData.save();
    return res.status(200).json(newData);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Error!! Please try again later!!" });
  }
});
router.post(
  "/",
  [
    check("first_name", "First name is required").not().isEmpty(),
    check("last_name", "Last name is required").not().isEmpty(),
    check("role", "Role is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty(),
    check("email", "Not a valid email id").isEmail(),
    check("password", "Password is required").not().isEmpty(),
    check("password", "Password length should be more than 8").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    const userFound = await dataModel.findOne({ email: req.body.email });
    if (userFound) {
      console.log("User exists");
      return res
        .status(409)
        .json({ msg: "User Already Exists! Use other Email Id to sign up!" });
    }
    if (req.files) {
      const myFile = req.files.file;
      console.log(myFile);
      console.log(__dirname);
      try {
        myFile.mv(`./public/${myFile.name}`, async function (err) {
          if (err) {
            return res
              .status(500)
              .json({ msg: "Error Occured while uploading file" });
          } else {
            const profileNew = myFile.name;
            const hashedPassword = await bcrypt.hash(req.body.password, 12);
            console.log(req.body);
            const newData = new dataModel({
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              role: req.body.role,
              contact: req.body.contact,
              memberid: req.body.memberid,
              email: req.body.email,
              emails: req.body.emails,
              workplace: req.body.workplace,
              designation: req.body.designation,
              password: hashedPassword,
              profile: profileNew,
              about: req.body.about,
            });
            await newData.save();
            return res.status(200).json(newData);
          }
        });
      } catch (error) {
        console.log(error);
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
          memberid: req.body.memberid,
          email: req.body.email,
          emails: req.body.emails,
          workplace: req.body.workplace,
          designation: req.body.designation,
          password: hashedPassword,
          subscription: req.body.subscription,
          about: req.body.about,
        });
        await newData.save();
        return res.status(200).json(newData);
      } catch (err) {
        console.log(err);
        return res
          .status(500)
          .json({ msg: "Error!! Please try again later!!" });
      }
    }
  }
);
router.get("/view", async (req, res) => {
  try {
    const data = await dataModel.find();
    res.json(data);
  } catch (err) {
    res.status(404).json({ msg: "No data found" });
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
    res.status(404).json({ msg: "No data found" });
  }
});
router.get("/founder", async (req, res) => {
  try {
    console.log("Members");
    console.log(req.body);
    const data = await dataModel.find({ founder: "true" }).select("-_id");
    console.log(data);
    res.json(data);
  } catch (err) {
    res.status(404).json({ msg: "No data found" });
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
        return res
          .status(404)
          .json({ msg: "Please Sign Up first! User not found" });
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
          return res.status(422).json({ msg: "Invalid Credentials" });
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
    const data = await dataModel
      .findById(req.user._id)
      .select("-_id -password");
    res.json(data);
  } catch (err) {
    res.status(404).json({ msg: "No data found" });
  }
});
router.get("/get/:email", async (req, res) => {
  console.log("update");
  try {
    const data = await dataModel.findOne({ email: req.params.email });
    res.json(data);
  } catch (err) {
    res.status(404).json({ msg: "No data found" });
  }
});

router.patch(
  "/update/:email",

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    console.log(req.body);
    if (req.files) {
      try {
        console.log("file");
        const myFile = req.files.file;
        console.log(myFile);
        try {
          myFile.mv(`./public/${myFile.name}`, async function (err) {
            if (err) {
              console.log(err);
              return res.status(500).json({ msg: "Error Occured" });
            } else {
              const updatedUser = await dataModel.findOne({
                email: req.params.email,
              });
              updatedUser.first_name = req.body.first_name;
              updatedUser.last_name = req.body.last_name;
              updatedUser.email = req.body.email;
              updatedUser.memberid = req.body.memberid;
              updatedUser.contact = req.body.contact;
              updatedUser.workplace = req.body.workplace;
              updatedUser.designation = req.body.designation;
              updatedUser.profile = myFile.name;
              updatedUser.about = req.body.about;
              await updatedUser.save();
              console.log(updatedUser);
              return res.status(200).json(updatedUser);
            }
          });
        } catch (error) {
          console.log(error);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const updatedUser = await dataModel.findOne({
          email: req.params.email,
        });
        updatedUser.first_name = req.body.first_name;
        updatedUser.last_name = req.body.last_name;
        updatedUser.email = req.body.email;
        updatedUser.grade = req.body.grade;
        updatedUser.memberid = req.body.memberid;
        updatedUser.contact = req.body.contact;
        updatedUser.workplace = req.body.workplace;
        updatedUser.designation = req.body.designation;
        updatedUser.profile = req.body.file;
        updatedUser.about = req.body.about;
        await updatedUser.save();
        console.log(updatedUser);
        return res.status(200).json(updatedUser);
      } catch (err) {
        res.status(404).json({ msg: "Error while updating data!" });
      }
    }
  }
);

router.get("/getrole", auth, async (req, res) => {
  try {
    const data = await dataModel
      .findById(req.user._id)
      .select("first_name last_name role profile -_id");
    return res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ msg: "User Not Found" });
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
        try {
          myFile.mv(`./public/${myFile.name}`, async function (err) {
            if (err) {
              console.log(err);
              return res.status(500).json({ msg: "Error Occured" });
            }
            const updatedUser = await dataModel.findById(req.user._id);
            updatedUser.first_name = req.body.first_name;
            updatedUser.last_name = req.body.last_name;
            updatedUser.email = req.body.email;
            updatedUser.memberid = req.body.memberid;
            updatedUser.contact = req.body.contact;
            updatedUser.workplace = req.body.workplace;
            updatedUser.designation = req.body.designation;
            updatedUser.profile = myFile.name;
            updatedUser.about = req.body.about;
            await updatedUser.save();
            console.log(updatedUser);
            return res.status(200).json(updatedUser);
          });
        } catch (error) {
          console.log(error);
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
      } catch (err) {
        res.status(404).json({ msg: "User Not Found" });
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
        updatedUser.memberid = req.body.memberid;
        updatedUser.workplace = req.body.workplace;
        updatedUser.designation = req.body.designation;
        updatedUser.profile = req.body.file;
        updatedUser.role = req.body.role;
        updatedUser.about = req.body.about;
        await updatedUser.save();
        console.log(updatedUser);
        return res.status(200).json(updatedUser);
      } catch (err) {
        res.status(404).json({ msg: "User Not Found" });
      }
    }
  }
);

router.delete("/:email", jsonParser, async (req, res) => {
  try {
    console.log(`Delete : ${req.params.email}`);
    const user = dataModel.find({ email: req.params.email }).deleteOne().exec();
    console.log(user);
    res.status(200).json("Deleted");
  } catch (err) {
    console.log(err);
    res.status(404).json({ msg: "Data Not found" });
  }
});
module.exports = router;
