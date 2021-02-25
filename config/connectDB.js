const mongoose = require("mongoose");
const config = require("config");

const con = config.get("mongoDBLink");

const connectDB = async () => {
    try {
        await mongoose.connect(con, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("database connected");
    } catch (err) {
        console.log("db not connected " + err);
        process.exit();
    }
};

module.exports = connectDB;