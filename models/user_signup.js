const {Int32} = require("bson");
const mongoose = require("mongoose");
const user_signup_schema = new mongoose.Schema(
    {
        first_name : {
            type : String,
            required : true
        },
        last_name : {
            type : String,
        },
        role : {
            type : String,
            required : true,
        },
        address : {
            type : String,
            required : true,
        },
        contactno : {
            type : String,
        },
        profileimage : {
            type : String,
        },
        email : {
            type : String,
        },
        work_place : {
            type : String,
            required : true,
        },
        designation : {
            type : String,
            required : true,
        },
        work_details : {
            type : String,
        }
    },
    {
        collection : "user_signup",
    }
);
module.exports = mongoose.model("user_signup", user_signup_schema);