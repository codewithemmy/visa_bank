const express = require("express");
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

const { updateProfile, createContact } = require("../controllers/profile");
const {
  fundTransfer,
  fundWithdrawal,
  fundDeposit,
} = require("../controllers/transaction");

const auth = require("../middleware/authentication");
const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").delete(auth, logout);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

//profile
router.route("/update-profile/:id").patch(updateProfile);
// router.route("/update-profile").post(uploadProductImage)
router.route("/create-contact").post(createContact);
router.route("/fund-transfer").post(auth, fundTransfer);
router.route("/fund-withdrawal").post(auth, fundWithdrawal);
router.route("/fund-deposit").post(auth, fundDeposit);

module.exports = router;
