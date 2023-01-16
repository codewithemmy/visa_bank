const express = require("express");
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").delete(logout);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

module.exports = router;
