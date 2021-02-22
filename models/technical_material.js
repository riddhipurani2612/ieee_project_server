const {Int32} = require("bson");
const mongoose = require("mongoose");
const technical_material_schema = mongoose.Schema(
    {
        title : {
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
        youtube_link : {
            type : String,
        },
        material_type : {
            type : String,
            required : true,
        },
        _id : {
            type : mongoose.Schema.Types.ObjectId,
        }
    },
    {
        collection : "technical_material"
    }
);
module.exports = mongoose.model("technical_material_schema",technical_material_schema)