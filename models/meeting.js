const { Int32 } = require("bson");
const mongoose = require("mongoose");
const meeting_schema = mongoose.Schema(
  {
    date: {
      type: Date,
    },
    place: {
      type: String,
    },
    attendees: {
      type: String,
    },
    summary: {
      type: String,
    },
    purpose: {
      type: String,
    },
    minutes: {
      type: String,
    },
    sign : {
      type : String,
    }
  },
  {
    collection: "meeting",
  }
);
module.exports = mongoose.model("meeting_schema", meeting_schema);
