//transaction should not hit or invoke the data

const { mailTransport } = require("../utils/sendEmail");

const fundTransfer = (req, res) => {
  const { amount } = req.body;

  if (amount) {
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

const fundWithdrawal = (req, res) => {
  const { amount } = req.body;

  if (amount) {
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
const fundDeposit = (req, res) => {
  const { amount } = req.body;

  if (amount) {
    mailTransport.sendMail({
      from: '"Mobi-Bank" <mobi-bank@gmail.com>', // sender address
      to: req.user.email, // list of receivers
      subject: "DEPOSIT SUCCESSFUL", // Subject line
      html: `<h4>Hello, ${req.user.firstName}, your deposit of ${amount} is successful</h4>`, // html body
    });

    return res
      .status(200)
      .json({ msg: `you deposit of ${amount} is successful` });
  }
  return res.status(400).json({ msg: `deposit is not completed ` });
};

module.exports = {
  fundTransfer,
  fundWithdrawal,
  fundDeposit,
};
