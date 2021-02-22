const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connectDB");
const app = express();
const logindataRoute = require("./routes/loginDataRoutes");
const bodyParser = require("body-parser");
const signupdataRoute = require("./routes/signupDataRoutes");
const eventRoute = require("./routes/eventRoutes");
const subjectRoute = require("./routes/subjectRoutes");
const technicalMaterialRoute = require("./routes/technicalMaterialDataRoutes");
const registrationRoute = require("./routes/registrationRoutes");
app.use(cors());

app.use("/login_data", logindataRoute);
app.use("/signup_data", signupdataRoute);
app.use("/event_data", eventRoute);
app.use("/subject_data", subjectRoute);
app.use("/techMaterial_data", technicalMaterialRoute);
app.use("/registration_data", registrationRoute);

const urlEncodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();
app.get("/", (req, res) => {
  res.send("Welcome to your own first Express API!!");
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.listen(5000, () => {
  console.log("Server started listening successfully on port 5000");
});
