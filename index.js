const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cookieParser = require("cookie-parser");
const CustomError = require("./errors/CustomError");
const GlobalErrorHandler = require("./middleware/GlobalErrorHandler");
const connectDB = require("./db");

// express
const app = express();

const corsOptions = {
  // origin: "http://localhost:5173",
  origin: "https://blog-ger.netlify.app",
  credentials: true,
};

connectDB();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Available Routes
app.use("/api/v1/blog-app/auth", require("./routes/auth"));
app.use("/api/v1/blog-app/posts", require("./routes/posts"));
app.use("/api/v1/blog-app/comments", require("./routes/comments"));
app.use("/api/v1/blog-app/search-tags", require("./routes/search"));
app.use("/api/v1/blog-app/tags", require("./routes/tags"));
app.use("/api/v1/blog-app/image", require("./routes/imageUpload"));
app.use("/api/v1/blog-app/social-media", require("./routes/socialMedia"));

// home route
app.get("/", (req, res) => {
  res.send("Blog App Node server");
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
app.listen(process.env.PORT, () => {
  console.log(`api listening at port ${process.env.PORT}`);
});
