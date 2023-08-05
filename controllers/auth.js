const User = require("../models/User");
const SocialMedia = require("../models/SocialMedia");
const CustomError = require("../errors/CustomError");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const { generateToken } = require("../utils/generateToken");

// signup
exports.signup = asyncErrorHandler(async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) throw new CustomError(400, false, "Please Login");
  user = new User({
    name,
    email,
    password,
  });
  const newUser = await user.save();
  if (!user) throw new CustomError(404, false, "User not created! Try again");
  await SocialMedia.create({
    user: newUser._id,
  });
  generateToken(newUser._id, res);
  res.status(200).json({ success: true, message: "Signup successfull" });
});

// login
exports.login = asyncErrorHandler(async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) throw new CustomError(401, false, "Please signup first");
  const passwordCompare = user.comparePassword(req.body.password);
  if (!passwordCompare) throw new CustomError(400, false, "Password Incorrect");
  generateToken(user._id, res);
  res.status(200).json({ success: true, message: "Login successfull" });
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
    .json({ success: true, message: "Your details are updated", user: user });
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
