const express = require("express");
const router = express.Router();
const confirmAuth = require("../middleware/confirmAuth");
const {
  signup,
  login,
  logout,
  getUserDetails,
  profileUpdate,
} = require("../controllers/auth");

// signup route
router.route("/signup").post(signup);

// login route
router.route("/login").post(login);

// logout route
router.route("/logout").get(logout);

// login route
router.route("/getUserDetails").get(confirmAuth, getUserDetails);

// profileUpdate route
router.route("/profileUpdate").put(confirmAuth, profileUpdate);

module.exports = router;
