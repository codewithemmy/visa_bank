const express = require("express");
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

const {
  updateProfile,
  createContact,
  getAccount,
} = require("../controllers/user/profile");
const {
  fundTransfer,
  fundWithdrawal,
  fundDeposit,
  getfundTransfer,
  getWithdrawal,
  getDeposit,
  transactionHistory,
  allTrasaction,
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

//create contact
router.route("/create-contact").post(createContact);

//get account
router.route("/get-account").get(auth, getAccount);

//funds routes
router.route("/fund-transfer").post(auth, fundTransfer);
router.route("/fund-withdrawal").post(auth, fundWithdrawal);
router.route("/fund-deposit").post(auth, fundDeposit);
router.route("/get-transfer").get(auth, getfundTransfer);
router.route("/get-withdrawal").get(auth, getWithdrawal);
router.route("/get-deposit").get(auth, getDeposit);
router.route("/all-transaction").get(auth, allTrasaction);

module.exports = router;
