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
router.use(auth)

router.route("/create-user-account").post(createUserAccount);
router.route("/delete-user-account/:id").delete( deleteUserAccount);
router.route("/edit-user-account/:id").patch(editUserAccount);
router.route("/get-user-account").get( getUserAccount);
router.route("/single-user-account/:id").get(singleUserAccount);

module.exports = router;
