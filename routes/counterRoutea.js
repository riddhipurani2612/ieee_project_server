const express = require("express");
const { request } = require("http");
const router = express.Router();
const bodyParser = require("body-parser");
const dataModel = require("../models/counter");
const { json } = require("body-parser");
const jsonParser = bodyParser.json();
router.get("/", async (req, res) => {
  const temp = await dataModel.find();
  console.log(`get ${temp}`);
  return res.status(200).json(temp);
});
router.post("/", async (req, res) => {
  try {
    const temp = await dataModel.find();
    console.log(temp);
    console.log(temp[0].count);
    const a = parseInt(temp[0].count) + 1;
    console.log(a);
    temp[0].count = a;
    await temp[0].save();
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;