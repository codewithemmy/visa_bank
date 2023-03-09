const UserAccount = require("../../models/UserAccount");
const User = require("../../models/User");
const History = require("../../models/History");
const TransferHistory = require("../../models/TransferHistory");

//admin register user
const adminCreateUser = async (req, res) => {
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
  const transactionId = req.params.id;
  const { date } = req.body;
  if (transactionId) {
    console.log(transactionId);
    const backdate = await TransferHistory.findByIdAndUpdate(
      { _id: transactionId },
      { date: date },
      { new: true, runValidators: true }
    );

    return res.status(200).json(backdate);
  }

  return res.status(200).json({ msg: `unable to backdate date` });
};

const getTransactions = async (req, res) => {
  const transferHistory = await TransferHistory.find({});
  return res.status(200).json({ transferHistory });
};

//get history
const getHistory = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(403).json({ msg: `you are not authorized to run this` });
  }

  const history = await History.find({ accountOwner: id }).sort("createdAt");

  return res.status(200).json({ history });
};

module.exports = {
  adminCreateUser,
  getHistory,
  backdateTransaction,
  getTransactions,
};
