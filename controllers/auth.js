const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const User = require("../models/User");
const CustomError = require("../errors/CustomError");

// signup
const signup = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

// login
const login = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

// logout
const logout = async (req, res, next) => {
  try {
    res.clearCookie("access_token", { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// getUserDetails
const getUserDetails = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, email, bio } = await User.findById(userId).select(
      "-password"
    );
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
  } catch (error) {
    next(error);
  }
};

// profileUpdate
const profileUpdate = async (req, res, next) => {
  try {
    let userInfo = {
      bio: req.body.bio,
    };
    let user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userInfo },
      { new: true }
    ).select("-password -createdAt -updatedAt -__v");
    res
      .status(200)
      .json({ success: true, message: "User details updates", user: user });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, logout, getUserDetails, profileUpdate };
