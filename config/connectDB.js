const mongoose = require("mongoose");
const config = require("config");

const con = config.get("mongoDBLink");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://root:root@cluster0.14ouf.mongodb.net/ieee_project?retryWrites=true&w=majority", {
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