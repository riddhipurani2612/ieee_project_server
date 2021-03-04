const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { request } = require("http");
const router = express.Router();
const bodyParser = require("body-parser");
const { json } = require("body-parser");
const jsonParser = bodyParser.json();
const dataModel = require("../models/user");
const { check, validationResult } = require("express-validator");
router.post(
    "/",
    [
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
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            const user = new dataModel({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                role: req.body.role,
                address: req.body.address,
                contact: req.body.contact,
                email: req.body.email,
                workplace: req.body.workplace,
                designation: req.body.designation,
                password: req.body.password,
                subscription: req.body.subscription,
            });
            await user.save();
            res.status(200).json(user);
        } catch (err) {
            res.status(404).end(user);
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
                if (user.password == req.body.password) {
                    return res.status(200).json(user);
                } else {
                    res.status(404).json({ errors: errors.array() });
                    console.log("INvalid");
                }
            }
        } catch (err) {
            console.log("error : " + err);
        }
    }
);
router.get("/:id", async (req, res) => {
    try {
        const data = await dataModel.findById(req.params.id);
        res.json(data);
    } catch (err) {
        res.send(err);
    }
});
router.patch(
    "/update",
    [
        [
            check("first_name", "First name is required").not().isEmpty(),
            check("last_name", "Last name is required").not().isEmpty(),
            check("role", "Role is required").not().isEmpty(),
            check("address", "Address is required").not().isEmpty(),
            check("email", "Email is required").not().isEmpty(),
            check("email", "Not a valid email id").isEmail(),
            check("workplace", "Workplace is required").not().isEmpty(),
            check("designation", "Designation is required").not().isEmpty(),
            check("password", "Password is required").not().isEmpty(),
            check("password", "Password length should be more than 8").isLength(
                {
                    min: 8,
                }
            ),
        ],
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
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
