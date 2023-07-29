const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const User = require("../models/User");
const SocialMedia = require("../models/SocialMedia");
const CustomError = require("../errors/CustomError");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");

// signup
exports.signup = asyncErrorHandler(async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    throw new CustomError(400, false, "Please Login");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);
  user = await User.create({
    name,
    email,
    password: hashedpassword,
  });
  const social_media = await SocialMedia.create({
    user: user._id,
  });
  const payload = {
    id: user._id,
  };
  const auth_token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  res
    .cookie("access_token", auth_token, {
      sameSite: "none",
      // sameSite: "strict",
      path: "/",
      expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true, // uncomment it while deployment
    })
    .status(200)
    .json({ success: true, message: "Signup successfull" });
});

// login
exports.login = asyncErrorHandler(async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new CustomError(401, false, "Please signup first");
  }
  const passwordCompare = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!passwordCompare) {
    throw new CustomError(400, false, "Password Incorrect");
  }
  const payload = {
    id: user.id,
  };
  const auth_token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  res
    .status(200)
    .cookie("access_token", auth_token, {
      sameSite: "none",
      // sameSite: "strict",
      path: "/",
      expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,      // uncomment it while deployment
    })
    .json({ success: true, message: "Login successfull" });
});

// logout
exports.logout = asyncErrorHandler(async (req, res) => {
  res.clearCookie("access_token", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// getUserDetails
exports.getUserDetails = asyncErrorHandler(async (req, res) => {
  const userId = req.user.id;
  const userDetails = await User.findById(userId).select(
    "name email bio image"
  );
  res.status(200).send({
    success: true,
    user: userDetails,
    message: "User details fetched",
  });
});

// profileUpdate
exports.profileUpdate = asyncErrorHandler(async (req, res) => {
  const { bio, name } = req.body;
  let user = await User.findOneAndUpdate(
    { _id: req.user.id },
    { $set: { bio: bio, name: name } },
    { new: true }
  ).select("-password -createdAt -updatedAt -__v");
  res
    .status(200)
    .json({ success: true, message: "User details updates", user: user });
});

exports.stillLoggedIn = asyncErrorHandler(async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({
      success: false,
      status: "logout",
      message: "Login session Expired! Please Login Again",
    });
  }
});
