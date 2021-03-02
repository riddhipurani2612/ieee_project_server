const {Int32} = require("bson");
const mongoose = require("mongoose");
const event_schema = mongoose.Schema(
    {
        name : {
            type : String,
            required : true,
        },
        date : {
            type : mongoose.Schema.Types.Date,
            default : mongoose.Schema.Types.Date.now,
        },
        text : {
            type : String,
        },
        image : {
            type : String,
        },
        material_type : {
            type : String,
            required : true,
        },
        uploadedby : {
            type : mongoose.Schema.Types.ObjectId,
        }
    },
    {
        collection : "event"
    }
);
module.exports = mongoose.model("event_schema",event_schema)