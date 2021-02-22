const {Int32} = require("bson");
const mongoose = require("mongoose");

const subject_schema = new mongoose.Schema(
    {
        subject : {
            type : String,
            required : true,
        }
    },
    {
        collection : "subject",
    }
)
module.exports = mongoose.model("subject", subject_schema);