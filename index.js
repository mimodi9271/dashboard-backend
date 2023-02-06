const mongoose = require("mongoose");
const express = require("express");
const config = require("config");
const home = require("./routes/Home");
const posts = require("./routes/Posts");
const users = require("./routes/Users");
const auth = require("./routes/Auth");
const allpost = require("./routes/Allpost");
const miderror = require("./middleware/error");
const helmet = require("helmet");
const compression = require("compression");
const winston = require("winston");
const app = express();
const cors = require("cors");

process.on("uncaughtException", (ex) => {
  winston.error(ex.message, ex);
});

process.on("unhandledRejection", (ex) => {
  winston.error(ex.message, ex);
});

winston.add(winston.transports.File, { filename: "logfile.log" });

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://127.0.0.1:27017/myproject")
  .then(() => console.log("connected to myproject database ..."))
  .catch((err) => console.log("some thing went wrong ..."));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json());
app.use(cors({
  origin: '*'
}));
app.use("/", home);
app.use("/api/posts", posts);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/allpost", allpost);
app.use(miderror);

app.use(helmet());
app.use(compression());

app.listen(5000, () => console.log("port 5000 is listening ..."));
