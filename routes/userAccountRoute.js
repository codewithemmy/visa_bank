const express = require("express");
const {
  createUserAccount,
  editUserAccount,
  deleteUserAccount,
  getUserAccount,
  singleUserAccount,
  getHistory,
} = require("../controllers/userAccount");

const auth = require("../middleware/authentication");

const router = express.Router();
router.use(auth);

router.route("/create-user-account").post(createUserAccount);
router.route("/edit-user-account/:id").patch(editUserAccount);
router.route("/get-user-account").get(getUserAccount);
router.route("/delete-user-account/:id").delete(deleteUserAccount);
router.route("/single-user-account/:id").get(singleUserAccount);
router.route("/get-history/:id").get(getHistory);

module.exports = router;
