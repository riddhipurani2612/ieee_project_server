const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { request } = require("http");
const router = express.Router();
const bodyParser = require("body-parser");
const { json } = require("body-parser");
const jsonParser = bodyParser.json();
const dataModel = require("../models/user");

router.post("/insert", jsonParser, async (req, res) => {
    try {
        const data = new dataModel({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            role: req.body.role,
            address: req.body.address,
            contact: req.body.contact,
            email: req.body.email,
            workplace: req.body.workplace,
            designation: req.body.designation,
            username: req.body.username,
            password: req.body.password,
            subscription: req.body.subscription,
        });
        await data.save();
        res.send("User added");
    } catch (err) {
        console.log("error : " + err);
    }
});
router.get("/view", async (req, res) => {
    try {
        const data = await dataModel.find();
        res.json(data);
    } catch (err) {
        res.send("error : " + err);
    }
});
router.post("/login", jsonParser, async (req, res) => {
    try {
        console.log(req.body);
        const user = await dataModel.findOne({ username: req.body.username });
        if (!user) {
            res.status(404).json({ error: "User not found" });
        } else {
            if (user.password == req.body.password) {
                res.status(200).json(user);
                console.log("valid");
            } else {
                res.status(401).json({ error: "Invalid Credentials" });
                console.log("INvalid");
            }
        }
    } catch (err) {
        console.log("error : " + err);
    }
});
router.post("/getvalues", jsonParser, async (req, res) => {
    console.log(req.body);
    const user = await dataModel.find({ _id: req.body._id });
    if (!user) {
        res.send("Data not found");
    } else {
        res.send(user);
    }
});
router.post("/delete", jsonParser, async (req, res) => {
    try {
        const status = await dataModel.deleteOne({ _id: req.body.id });
        res.send("deleted");
    } catch (err) {
        console.log(err);
    }
});
router.patch("/update", jsonParser, async (req, res) => {
    try {
        const user = await dataModel.findOne({ _id: req.body._id });
        user.first_name = req.body.first_name;
        user.last_name = req.body.last_name;
        user.address = req.body.address;
        user.email = req.body.email;
        user.contact = req.body.contact;
        user.workplace = req.body.workplace;
        user.designation = req.body.designation;
        await user.save();
        console.log(user);
        res.json(user);
    } catch (err) {
        console.log(err);
    }
});
router.delete("/delete", jsonParser, async (req, res) => {
    try {
        console.log(req.body);
        const uer = await dataModel.deleteOne({ _id: req.body._id });
        console.log("Data : " + uer);
        res.send("Deleted");
    } catch (err) {
        console.log(err);
    }
});
module.exports = router;
