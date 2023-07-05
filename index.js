const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./db");
connectDB();

// express
const express = require("express");
const app = express();
const port = process.env.PORT;
const cookieParser = require("cookie-parser");
const CustomError = require("./errors/CustomError");
const GlobalErrorHandler = require("./middleware/GlobalErrorHandler");

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Available Routes
app.use("/api/v1/blog-app/auth", require("./routes/auth"));
app.use("/api/v1/blog-app/posts", require("./routes/posts"));
app.use("/api/v1/blog-app/comments", require("./routes/comments"));
app.use("/api/v1/blog-app/search", require("./routes/search"));
// add search routes for tags and titles(posts), for names(users)

// home route
app.get("/", (req, res) => {
  res.send("Blog App Server");
});

// throw error for wrong route
app.all("*", (req, res, next) => {
  try {
    throw new CustomError(404, false, "Route not defined");
  } catch (error) {
    next(error);
  }
});

// handling error using express Global Error Handler
app.use(GlobalErrorHandler);

// listen to port
app.listen(port, () => {
  console.log(`api listening at port ${port}`);
});
