const express = require("express");
const {
  adminCreateUser,
  backdateTransaction,
  getTransactions,
  adminGetSingleProfile,
  adminGetAllTransaction,
  adminGetfundTransfer,
  adminGetSingleDeposit,
  adminGetSingletWithdrawal,
  backdateTransfer,
  backdateWithdrawal,
  backdateDeposit,
} = require("../../controllers/admin/createUser");
const {
  editUserAccount,
  deleteUserAccount,
  singleUserAccount,
  getHistory,
  getUserAccount,
} = require("../../controllers/admin/userAccount");

const auth = require("../../middleware/authentication");

const router = express.Router();

router.route("/edit-user-account/:id").patch(auth, editUserAccount);
router.route("/get-user-account").get(auth, getUserAccount);
router.route("/delete-user-account/:id").delete(auth, deleteUserAccount);
router.route("/single-user-account/:id").get(auth, singleUserAccount);
router.route("/get-history/:id").get(auth, getHistory);

//admin customizing user
router.route("/admin-create-user").post(auth, adminCreateUser);
router.route("/admin-backdate-transfer/:id").post(auth, backdateTransfer);
router.route("/admin-backdate-deposit/:id").post(auth, backdateDeposit);
router.route("/admin-backdate-withdrawal/:id").post(auth, backdateWithdrawal);
router.route("/transaction-history").get(auth, getTransactions);
router.route("/admin-get-profile/:id").get(auth, adminGetSingleProfile);
router
  .route("/admin-get-all-user-transaction/:id")
  .get(auth, adminGetAllTransaction);
router.route("/admin-get-fund-transfer/:id").get(auth, adminGetfundTransfer);
router
  .route("/admin-get-deposit-transfer/:id")
  .get(auth, adminGetSingleDeposit);
router
  .route("/admin-get-withdrawal-transfer/:id")
  .get(auth, adminGetSingletWithdrawal);

module.exports = router;
