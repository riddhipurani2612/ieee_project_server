const { Int32 } = require("bson");
const mongoose = require("mongoose");

const user_schema = new mongoose.Schema(
  {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    role: {
      type: String,
    },
    contact: {
      type: String,
    },
    email: {
      type: String,
    },
    workplace: {
      type: String,
    },
    designation: {
      type: String,
    },
    about: {
      type: String,
    },
    memberid : {
        type : String,
    },
    password: {
      type: String,
    },
    profile: {
      type: String,
    },
    founder : {
      type : String,
    }
  },
  {
    collection: "user",
  }
);
module.exports = mongoose.model("user", user_schema);
