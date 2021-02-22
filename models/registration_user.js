const {Int32} = require("bson");
const mongoose = require("mongoose");

const registration_user = new mongoose.Schema(
    {
        date :{
            type : mongoose.Schema.Types.Date,
            default : mongoose.Schema.Types.Date.now,
        },
        amount : {
            type : mongoose.Schema.Types.Decimal128,
        },
        _id : {
            type : mongoose.Schema.Types.ObjectId,
        }
    },
    {
        collection : "registration_user"
    }
);
module.exports = mongoose.model("registration_user",registration_user);