const express = require("express");
const { adminCreateUser } = require("../../controllers/admin/createUser");
const {
  editUserAccount,
  deleteUserAccount,
  singleUserAccount,
  getHistory,
  getUserAccount,
} = require("../../controllers/admin/userAccount");

const auth = require("../../middleware/authentication");

const router = express.Router();

// router.route("/create-user-account").post(auth, createUserAccount);
router.route("/edit-user-account/:id").patch(auth, editUserAccount);
router.route("/get-user-account").get(auth, getUserAccount);
router.route("/delete-user-account/:id").delete(auth, deleteUserAccount);
router.route("/single-user-account/:id").get(auth, singleUserAccount);
router.route("/get-history/:id").get(auth, getHistory);


//admin customizing user
router.route("/admin-create-user").post(auth, adminCreateUser);



module.exports = router;
