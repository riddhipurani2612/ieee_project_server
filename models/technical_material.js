const {Int32} = require("bson");
const mongoose = require("mongoose");
const technical_material_schema = mongoose.Schema(
    {
        title : {
            type : String,
        },
        about : {
            type : String,
        },
        youtubelink : {
            type : String,
        },
        materialfile:{
            type : String,
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