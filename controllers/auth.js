const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const User = require("../models/User");
const CustomError = require("../errors/CustomError");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");

// signup
exports.signup = asyncErrorHandler(async (req, res ) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    throw new CustomError(400, false, "Please Login");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(req.body.password, salt);
  user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedpassword,
  });
  const payload = {
    id: user.id,
  };
  const auth_token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: 86000,
  }); // confirm expiration
  res
    .cookie("access_token", auth_token, {
      httpOnly: true,
    })
    .status(200)
    .json({ success: true, message: "Signup successfull" });
});

// login
exports.login = asyncErrorHandler(async (req, res ) => {
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
    expiresIn: 86000,
  });
  res
    .cookie("access_token", auth_token, {
      httpOnly: true,
    })
    .status(200)
    .json({ success: true, message: "Login successfull" });
});

// logout
exports.logout = asyncErrorHandler(async (req, res) => {
  res.clearCookie("access_token", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "Logged out successfully" });
});

// getUserDetails
exports.getUserDetails = asyncErrorHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, email, bio } = await User.findById(userId).select("-password");
  const userDetails = {
    name: name,
    email: email,
    bio: bio,
  };
  res.status(200).send({
    success: true,
    user: userDetails,
    message: "User details fetched",
  });
});

// profileUpdate
exports.profileUpdate = asyncErrorHandler(async (req, res) => {
  let user = await User.findOneAndUpdate(
    { _id: req.user.id },
    { $set: { bio: req.body.bio } },
    { new: true }
  ).select("-password -createdAt -updatedAt -__v");
  res
    .status(200)
    .json({ success: true, message: "User details updates", user: user });
});
