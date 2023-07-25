const express = require("express");
const router = express.Router();
const confirmAuth = require("../middleware/confirmAuth");
const {
  signup,
  login,
  logout,
  getUserDetails,
  profileUpdate,
  stillLoggedIn,
} = require("../controllers/auth");

// signup route
router.route("/signup").post(signup);

// login route
router.route("/login").post(login);

// logout route
router.route("/logout").get(logout);

// getUserDetails route
router.route("/getUserDetails").get(confirmAuth, getUserDetails);

// profileUpdate route
router.route("/profile-update").put(confirmAuth, profileUpdate);

// stillLoggedIn route
router.route("/verify-login").get(stillLoggedIn);

module.exports = router;
