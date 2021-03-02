const {Int32} = require("bson");
const mongoose = require("mongoose");
const feedback_schema = mongoose.Schema(
    {
        name : {
            type : String,
        },
        email : {
            type : String,
        },
        contact : {
            type : String,
        },
        address : {
            type : String,
        },
        subject : {
            type : String,
        },
        message : {
            type : String,
        }
    },
    {
        collection : "feedback"
    }
);
module.exports = mongoose.model("feedback_schema",feedback_schema)