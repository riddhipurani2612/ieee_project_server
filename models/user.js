const {Int32} = require("bson");
const mongoose = require("mongoose");

const user_schema = new mongoose.Schema(
    {
        first_name : {
            type : String,
            required : true
        },
        last_name : {
            type : String,
            required : true
        },
        role : {
            type : String,
            required : true
        },
        address : {
            type : String,
        },
        contact : {
            type : String,
        },
        email : {
            type :String,
            required : true
        },
        workplace : {
            type : String,
            required : true
        },
        designation : {
            type : String,
        },
        about : {
            type : String,
        },
        password : {
            type :String,
            required : true
        },
    },
    {
        collection : "user",
    }
)
module.exports = mongoose.model("user", user_schema);