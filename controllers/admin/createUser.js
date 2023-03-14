const UserAccount = require("../../models/UserAccount");
const User = require("../../models/User");
const History = require("../../models/History");
const TransferHistory = require("../../models/TransferHistory");

//admin register user
const adminCreateUser = async (req, res) => {
  if (req.user.role !== "super-admin") {
    return res
      .status(403)
      .json({ msg: `you are unauthorized to perform this task` });
  }
  const { firstName, lastName, email, password, role, mobile, country } =
    req.body;

  const emailExist = await User.findOne({ email });
  if (emailExist) {
    return res.status(400).json({ msg: "email already exist" });
  }

  const user = await User.create({
    accountNo: "",
    firstName,
    lastName,
    email,
    password,
    role,
    mobile,
    country,
  });

  // //send Mail
  // mailTransport.sendMail({
  //   from: '"Mobi-Bank" <mobi-bank@gmail.com>', // sender address
  //   to: email, // list of receivers
  //   subject: "REGISTRATION SUCCESSFUL", // Subject line
  //   html: `<h4>Hello, ${firstName}, You have successfully registered with MobiBank, Welcome on board</h4>`, // html body
  // });

  const generateAccount = () => {
    let random = Math.floor(Math.random() * 100000000) + "";
    return "MB" + random.padStart(8, "0");
  };

  const account = await UserAccount.create({
    accountNo: generateAccount(),
    availableBalance: 0,
    transactions: 0,
    withdrawals: 0,
    deposits: 0,
    fdr: 0,
    dps: 0,
    loans: 0,
    accountOwner: user._id,
  });

  const accountNumber = (user.accountNo = account.accountNo);
  await user.save();

  return res
    .status(201)
    .json({ msg: `Your registration is successful`, user, account });
};

//backdate history
const backdateTransaction = async (req, res) => {
  if (req.user.role !== "super-admin" || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ msg: `you are unauthorized to perform this task` });
  }
  const transactionId = req.params.id;
  const { date } = req.body;
  if (transactionId) {
    const backdate = await TransferHistory.findByIdAndUpdate(
      { _id: transactionId },
      { createdAt: date },
      { new: true, runValidators: true }
    );

    return res.status(200).json(backdate);
  }

  return res.status(200).json({ msg: `unable to backdate date` });
};

const getTransactions = async (req, res) => {
  if (req.user.role !== "super-admin" || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ msg: `you are unauthorized to perform this task` });
  }
  const transferHistory = await TransferHistory.find({}).populate({
    path: "accountOwner",
    select: "firstName lastName",
  });
  return res.status(200).json({ transferHistory });
};

//get history
const getHistory = async (req, res) => {
  if (req.user.role !== "super-admin" || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ msg: `you are unauthorized to perform this task` });
  }
  const { id } = req.params;
  if (!id) {
    return res.status(403).json({ msg: `you are not authorized to run this` });
  }

  const history = await History.find({ accountOwner: id }).sort("createdAt");

  return res.status(200).json({ history });
};

//get single profile
const adminGetSingleProfile = async (req, res) => {
  if (req.user.role !== "super-admin" || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ msg: `you are unauthorized to perform this task` });
  }
  if (req.user.role !== "super-admin") {
    return res
      .status(403)
      .json({ msg: `you are unauthorized to perform this task` });
  }
  const profile = await User.find({ _id: req.params.id });
  return res.status(200).json(profile);
};

const adminGetAllTransaction = async (req, res) => {
  if (req.user.role !== "super-admin" || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ msg: `you are unauthorized to perform this task` });
  }
  const user = req.user.userId;
  if (user) {
    const deposit = await DepositHistory.find({ accountOwner: req.params.id });
    const withdrawal = await WithdrawalHistory.find({
      accountOwner: req.params.id,
    });
    const transaction = await TransferHistory.find({
      accountOwner: req.params.id,
    });

    return res.status(200).json({ deposit, withdrawal, transaction });
  }
  return res.status(400).json({ msg: `unable to get deposit` });
};

module.exports = {
  adminCreateUser,
  getHistory,
  backdateTransaction,
  getTransactions,
  adminGetSingleProfile,
  adminGetAllTransaction,
};
