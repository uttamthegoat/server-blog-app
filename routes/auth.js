const express = require("express");
const router = express.Router();
const confirmAuth = require("../middleware/confirmAuth");
const {
  signup,
  login,
  logout,
  getUserDetails,
  profileUpdate
} = require("../controllers/auth");

// signup route
router.post("/signup", signup);

// login route
router.post("/login", login);

// logout route
router.get("/logout", logout);

// login route
router.get("/getUserDetails", confirmAuth, getUserDetails);

// profileUpdate route
router.post("/profileUpdate", confirmAuth, profileUpdate);

module.exports = router;