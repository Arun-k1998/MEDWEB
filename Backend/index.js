require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require('morgan')

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
app.use(morgan('dev'))

const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const docotRoute = require("./routes/doctorRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");


app.use("/", userRoute);
app.use("/admin", adminRoute);
app.use("/doctor", docotRoute);
// app.use("/chat", chatRoute);
// app.use("/message", messageRoute);

const server = app.listen(4001, () => {
  console.log(`port running at ${4001} port`);
});


// --------socket connection start---

const io = require("socket.io")(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  socket.on("new-user-add", (newUserId) => {
    console.log("-----");
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }
    console.log(activeUsers,'active users');
    io.emit("get-users", activeUsers);
  });

  socket.on("send-message", (data) => {
    const { receiverId } = data;

    const user = activeUsers.find((user) => user.userId === receiverId);

    if (user) {
      console.log("messag send", receiverId);
      io.to(user.socketId).emit("receive-message", data);
    }
  });

  socket.on("disconnected", (userId) => {
    activeUsers = activeUsers.filter((user) => user.userId !== userId);
    io.emit("get-users", activeUsers);
    console.log("userDisconnected", activeUsers);
  });
});
// --------socket end-------------