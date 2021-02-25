const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const userModel = require("../models/User");
const projectModel = require("../models/Project");
const certficateModel = require("../models/Certificate");
const languageModel = require("../models/Language");

router.get("/", auth, async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res
                .status(400)
                .json({ errors: [{ msg: "user not found" }] });
        }

        const projectCount = await projectModel
            .countDocuments({ user: user._id })
            .exec();

        const certificateCount = await certficateModel
            .countDocuments({ user: user._id })
            .exec();

        const languageCount = await languageModel
            .countDocuments({ user: user._id })
            .exec();

        const updatedUser = {
            user,
            projectCount,
            certificateCount,
            languageCount,
        };

        return res.json(updatedUser);
    } catch (error) {
        res.status(500).end(error);
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
            const { email, password } = req.body;

            const userFound = await userModel.findOne({ email });

            if (!userFound) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "invalid credentials" }] });
            }

            const isMatch = await bcrypt.compare(password, userFound.password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "invalid credentials" }] });
            }

            const payload = {
                user: {
                    id: userFound.id,
                    name: userFound.firstname,
                },
            };

            jwt.sign(
                payload,
                config.get("secretKey"),
                { expiresIn: 36000 },
                (error, token) => {
                    if (error) throw error;
                    res.json({ token });
                }
            );
        } catch (error) {
            res.status(500).end(error);
        }
    }
);

router.post(
    "/",
    [
        check("email", "Not a valid email id").isEmail(),
        check("password", "Password is required").not().isEmpty(),
        check("firstname", "First Name is required").not().isEmpty(),
        check("lastname", "Last Name is required").not().isEmpty(),
        check("city", "City is required").not().isEmpty(),
        check("province", "Province is required").not().isEmpty(),
        check("country", "Country is required").not().isEmpty(),
        check("email", "Email is required").not().isEmpty(),
        check(
            "password",
            "Password should be minimum of 6 characters"
        ).isLength({
            min: 6,
        }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            const hashedPassword = await bcrypt.hash(req.body.password, 12);

            const newUser = new userModel({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hashedPassword,
                phone: req.body.phone,
                city: req.body.city,
                province: req.body.province,
                country: req.body.country,
            });

            await newUser.save();

            const payload = {
                user: {
                    id: newUser.id,
                    name: newUser.firstname,
                },
            };

            jwt.sign(
                payload,
                config.get("secretKey"),
                { expiresIn: 36000 },
                (error, token) => {
                    if (error) throw error;
                    res.json({ token });
                }
            );
        } catch (error) {
            res.status(500).end(error);
        }
    }
);

router.patch(
    "/",
    auth,
    [
        check("email", "Not a valid email id").isEmail(),
        check("firstname", "First Name is required").not().isEmpty(),
        check("lastname", "Last Name is required").not().isEmpty(),
        check("city", "City is required").not().isEmpty(),
        check("province", "Province is required").not().isEmpty(),
        check("country", "Country is required").not().isEmpty(),
        check("email", "Email is required").not().isEmpty(),
    ],
    async (req, res) => {
        try {
            const user = await userModel.findById(req.user.id);
            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "user not found" }] });
            }

            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;
            user.city = req.body.city;
            user.province = req.body.province;
            user.country = req.body.country;

            await user.save();

            res.json(user);
        } catch (error) {}
    }
);

module.exports = router;