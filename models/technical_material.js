const {Int32} = require("bson");
const mongoose = require("mongoose");
const technical_material_schema = mongoose.Schema(
    {
        title : {
            type : String,
            required : true,
        },
        text : {
            type : String,
        },
        youtubelink : {
            type : String,
        },
        files:{
            type : Array,
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
        collection : "technical_material"
    }
);
module.exports = mongoose.model("technical_material_schema",technical_material_schema)