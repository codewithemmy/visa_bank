const UserAccount = require("../models/UserAccount");
const User = require("../models/User");

//create user
const createUserAccount = async (req, res) => {
  const {
    userEmail,
    availableBalance,
    transactions,
    withdrawals,
    deposits,
    fdr,
    dps,
    loans,
  } = req.body;

  const superUser = req.user;

  const generateAccount = () => {
    let random = Math.floor(Math.random() * 100000000) + "";
    return "MB" + random.padStart(8, "0");
  };

  if (superUser) {
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(400).json({ msg: `the email does not exist` });
    }

    const userId = user._id;

    const createAccount = await UserAccount.create({
      accountNo: generateAccount(),
      availableBalance,
      transactions,
      withdrawals,
      deposits,
      fdr,
      dps,
      loans,
      accountOwner: userId,
    });

    return res.status(201).json(createAccount);
  }
  return res.status(400).json({ msg: `error creating account` });
};

//edit user
const editUserAccount = async (req, res) => {
  const { id } = req.params;

  const confirmId = await UserAccount.findOne({ _id: id });
  if (!confirmId) {
    return res.status(400).json({ msg: `invalid id used` });
  }

  const user = await UserAccount.findByIdAndDelete({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(201).json({ msg: `Account successfuly updated`, user });
};

delete user
const deleteUserAccount = async (req, res) => {
  const { id } = req.params;

  const confirmId = await UserAccount.findOne({ _id: id });
  if (!confirmId) {
    return res.status(400).json({ msg: `invalid id used` });
  }

  const user = await UserAccount.findByIdAndRemove({ _id: id });

  return res.status(201).json({ msg: `Account successfuly deleted` });
};

//get user
const getUserAccount = async (req, res) => {
  const superAdmin = req.user;
  if (superAdmin) {
    const getUserAccount = await UserAccount.find();
    return res.status(200).json(getUserAccount);
  }
  return res.status(400).json({ msg: `error getting userAccount` });
};

//get single user
const singleUserAccount = async (req, res) => {
  const { id } = req.params;
  const superAdmin = req.user;
  if (superAdmin) {
    const singleUserAccount = await UserAccount.find({ _id: id });
    return res.status(200).json(singleUserAccount);
  }
  return res.status(400).json({ msg: `error getting single user account` });
};

module.exports = {
  createUserAccount,
  editUserAccount,
  deleteUserAccount,
  getUserAccount,
  singleUserAccount,
};
