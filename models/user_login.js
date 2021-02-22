const { Int32 } = require("bson");
const mongoose = require("mongoose");

const user_login_schema = new mongoose.Schema(
    {
        user_name : {
            type : String,
            required : true,
        },
        password : {
            type : String,
            required : true,
        }
    },
    {
        collection: "user_login",
    }
);
module.exports = mongoose.model("user_login", user_login_schema);