const express = require("express");
const path=require("path");
const cors = require("cors");
const connectDB = require("./config/connectDB");
const app = express();
const bodyParser = require("body-parser");
const eventRoute = require("./routes/eventRoutes");
const technicalMaterialRoute = require("./routes/technicalMaterialDataRoutes");
const userRoute = require("./routes/userRoutes");
const feedbackRoute = require("./routes/feedbackRoute");
const meetingRoute = require("./routes/meetingRoute");
const port = process.env.PORT || 5000;
const fileUpload = require("express-fileupload");
const urlEncodedParser = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
connectDB();

app.use(cors());
app.use(express.static("public"));
app.use(fileUpload());


app.post("/upload", (req, res) => {
  if (!req.files) return res.status(500).send({ msg: "File not Found" });

  const myFile = req.files.file;
  console.log(myFile);z
  try {
      myFile.mv(`${__dirname}/public/${myFile.name}`, function (err) {
          if (err) {
              console.log(err);
              return res.status(500).send({ msg: "Error Occured" });
          }
          return res
              .status(200)
              .send({ name: myFile.name, path: `/${myFile.name}` });
      });
  } catch (error) {
      console.log(error);
  }
});



app.get("/ping", (req, res) => {
  res.send("pong");
});

app.listen(port, () => {
  console.log("Server started listening successfully on port 5000");
});

app.use("/event", eventRoute);
app.use("/techMaterial", technicalMaterialRoute);
app.use("/user",userRoute);
app.use("/feedback",feedbackRoute);
app.use("/meeting",meetingRoute);
app.get("/", (req, res) => {
  res.send("Welcome to your own first Express API!!");
});