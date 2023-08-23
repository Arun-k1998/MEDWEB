require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

mongoose
  .connect(process.env.MONGOCONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => { 
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(express.json());
// app.use(express.urlencoded({extended:false}))
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf; // Save the raw body data
    },
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const docotRoute = require("./routes/doctorRoute");

app.use("/", userRoute);
app.use("/admin", adminRoute);
app.use("/doctor", docotRoute);

app.listen(4001, () => {
  console.log(`port running at ${4001} port`);
});
