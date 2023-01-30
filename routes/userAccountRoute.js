const express = require("express");
const {
  createUserAccount,
  editUserAccount,
  deleteUserAccount,
  getUserAccount,
  singleUserAccount,
} = require("../controllers/userAccount");

const auth = require("../middleware/authentication");

const router = express.Router();

router.route("/create-user-account").post(auth, createUserAccount);
router.route("/delete-user-account/:id").delete(auth, deleteUserAccount);
router.route("/edit-user-account/:id").patch(auth, editUserAccount);
router.route("/get-user-account").get(auth, getUserAccount);
router.route("/single-user-account/:id").get(auth, singleUserAccount);

module.exports = router;
