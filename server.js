const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connectDB");
const app = express();
const bodyParser = require("body-parser");
const eventRoute = require("./routes/eventRoutes");
const subjectRoute = require("./routes/subjectRoutes");
const technicalMaterialRoute = require("./routes/technicalMaterialDataRoutes");
const userRoute = require("./routes/userRoutes");
app.use(cors());

app.use("/event_data", eventRoute);
app.use("/subject_data", subjectRoute);
app.use("/techMaterial_data", technicalMaterialRoute);
app.use("/user",userRoute);

const urlEncodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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
