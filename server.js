const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connectDB");
const app = express();
const bodyParser = require("body-parser");
const eventRoute = require("./routes/eventRoutes");
const technicalMaterialRoute = require("./routes/technicalMaterialDataRoutes");
const userRoute = require("./routes/userRoutes");
const feedbackRoute = require("./routes/feedbackRoute");

const port = process.env.PORT || 5000;
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
connectDB();

app.use(cors());

app.use("/event", eventRoute);
app.use("/techMaterial", technicalMaterialRoute);
app.use("/user",userRoute);
app.use("/feedback",feedbackRoute)

app.get("/", (req, res) => {
  res.send("Welcome to your own first Express API!!");
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.listen(port, () => {
  console.log("Server started listening successfully on port 5000");
});
