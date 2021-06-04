const { Int32 } = require("bson");
const mongoose = require("mongoose");

const count_schema = new mongoose.Schema(
  {
      count : {
          type : String,
          require : true,
      }
  },
  {
    collection: "count",
  }
);
module.exports = mongoose.model("count", count_schema);
