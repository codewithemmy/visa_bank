const WithdrawalHistory = require("../models/WithdrawalHistory");
const TransferHistory = require("../models/TransferHistory");
const DepositHistory = require("../models/DepositHistory");
const User = require("../models/User");

const { mailTransport } = require("../utils/sendEmail");

//fund transfer & history creation
const fundTransfer = async (req, res) => {
  const { amount } = req.body;
  if (amount) {
    const userId = req.user.userId;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({ msg: `you are not a user` });
    }

    const accountNo = user.accountNo;

    await TransferHistory.create({
      accountOwner: userId,
      accountNo,
      amount,
    });

    mailTransport.sendMail({
      from: '"Mobi-Bank" <mobi-bank@gmail.com>', // sender address
      to: req.user.email, // list of receivers
      subject: "TRANSFER SUCCESSFUL", // Subject line
      html: `<h4>Hello, ${req.user.firstName}, you transfer of ${amount} is successful</h4>`, // html body
    });

    return res
      .status(200)
      .json({ msg: `your transfer of ${amount} is successful` });
  }
  return res.status(400).json({ msg: `Transfer is not completed ` });
};

//fund withdrawal & history creation
const fundWithdrawal = async (req, res) => {
  const { amount } = req.body;

  if (amount) {
    const userId = req.user.userId;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({ msg: `you are not a user` });
    }

    const accountNo = user.accountNo;

    await WithdrawalHistory.create({
      accountOwner: userId,
      accountNo,
      amount,
    });

    mailTransport.sendMail({
      from: '"Mobi-Bank" <mobi-bank@gmail.com>', // sender address
      to: req.user.email, // list of receivers
      subject: "WITHDRAWAL SUCCESSFUL", // Subject line
      html: `<h4>Hello, ${req.user.firstName}, your withdrawal of ${amount} is successful</h4>`, // html body
    });

    return res
      .status(200)
      .json({ msg: `you withdrawal of ${amount} is successful` });
  }
  return res.status(400).json({ msg: `withdrawal is not completed ` });
};

// fund deposit and history
const fundDeposit = async (req, res) => {
  const { amount } = req.body;

  if (amount) {
    const userId = req.user.userId;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({ msg: `you are not a user` });
    }

    const accountNo = user.accountNo;

    await DepositHistory.create({
      accountOwner: userId,
      accountNo,
      amount,
    });

    mailTransport.sendMail({
      from: '"Mobi-Bank" <mobi-bank@gmail.com>', // sender address
      to: req.user.email, // list of receivers
      subject: "DEPOSIT SUCCESSFUL", // Subject line
      html: `<h4>Hello, ${req.user.firstName}, your deposit of is successful</h4>`, // html body
    });

    return res
      .status(200)
      .json({ msg: `you deposit of ${amount} is successful` });
  }
  return res.status(400).json({ msg: `deposit is not completed ` });
};

//get transfer history
const getfundTransfer = async (req, res) => {
  const user = req.user.userId;
  if (user) {
    const transfer = await TransferHistory.find({
      accountOwner: user,
    }).populate("accountOwner");

    return res.status(200).json({ transfer });
  }
  return res.status(400).json({ msg: `unable to get transfer` });
};

//get Withdrawal history
const getWithdrawal = async (req, res) => {
  const user = req.user.userId;
  if (user) {
    const withdrawal = await WithdrawalHistory.find({
      accountOwner: user,
    }).populate("accountOwner");

    return res.status(200).json({ withdrawal });
  }
  return res.status(400).json({ msg: `unable to get withdrawal` });
};

//get deposit history
const getDeposit = async (req, res) => {
  const user = req.user.userId;
  if (user) {
    const deposit = await DepositHistory.find({ accountOwner: user }).populate(
      "accountOwner"
    );

    return res.status(200).json({ deposit });
  }
  return res.status(400).json({ msg: `unable to get deposit` });
};

const allTrasaction = async (req, res) => {
  const user = req.user.userId;
  if (user) {
    const deposit = await DepositHistory.find({ accountOwner: user });
    const withdrawal = await WithdrawalHistory.find({ accountOwner: user });
    const transaction = await TransferHistory.find({ accountOwner: user });

    return res.status(200).json({ deposit, withdrawal, transaction });
  }
  return res.status(400).json({ msg: `unable to get deposit` });
};

module.exports = {
  fundTransfer,
  fundWithdrawal,
  fundDeposit,
  getfundTransfer,
  getWithdrawal,
  getDeposit,
  allTrasaction,
};
