const { Int32 } = require("bson");
const mongoose = require("mongoose");
const event_schema = mongoose.Schema(
  {
    eventname: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
    },
    time : {
      type : String,
    },
    about: {
      type: String,
    },
    hostedby: {
      type: String,
    },
    registrationlink : {
      type : String,
    },
    eventimage : {
      type : String,
    },
    attendees : {
      type : String,
    }
  },
  {
    collection: "event",
  }
);
module.exports = mongoose.model("event_schema", event_schema);
