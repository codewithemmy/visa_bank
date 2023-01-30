require("dotenv").config();
require("express-async-errors");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");

// extra security packages
// const helmet = require('helmet');
const cors = require("cors");
// const xss = require('xss-clean');
// const rateLimiter = require('express-rate-limit');

const connectDB = require("./db/connect");
// const authenticateUser = require("./middleware/authentication");

// routers
const authRouter = require("./routes/authRoute");
const userAccountRouter = require("./routes/userAccountRoute");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//serve exprss json
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1", userAccountRouter);

const port = process.env.PORT || 5000;

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
