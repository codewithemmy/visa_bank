const User = require("../models/User");
const UserAccount = require("../models/UserAccount");
const { StatusCodes } = require("http-status-codes");
const createHash = require("../utils/createHash");
const crypto = require("crypto");
const { mailTransport } = require("../utils/sendEmail");

//sign up user
const signup = async (req, res) => {
  const { firstName, lastName, email, password, role, mobile, country } =
    req.body;

  const emailExist = await User.findOne({ email });
  if (emailExist) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "email already exist" });
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
    mobile,
    country,
  });

  //send Mail
  mailTransport.sendMail({
    from: '"Mobi-Bank" <mobi-bank@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "REGISTRATION SUCCESSFUL", // Subject line
    html: `<h4>Hello, ${firstName}, You have successfully registered with MobiBank, Welcome on board</h4>`, // html body
  });

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

  return res
    .status(StatusCodes.CREATED)
    .json({ msg: `Your registration is successful`, user, account });
};

//user login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Please provide email or password" });
  }
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid details" });
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Password is not valid" });
  }

  let token = user.createJWT();

  return res
    .status(StatusCodes.OK)
    .json({ msg: "Login Successful", user, token: token });
};

//logout
const logout = async (req, res) => {
  const user = req.user;
  if (user) {
    delete req.headers.authorization.split(" "[1]);

    return res.status(StatusCodes.OK).json({ msg: `delete successful` });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: `delete unsuccessful` });
};

//forget password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide valid email" });
  }

  const user = await User.findOne({ email });

  if (user) {
    const passwordToken = crypto.randomBytes(2).toString("hex");

    // send email
    mailTransport.sendMail({
      from: '"Mobi-Bank" <mobibank@gmail.com>', // sender address
      to: email,
      subject: "Reset you account",
      html: `Hi, kindly reset your password with this token: <h4>${passwordToken}</h4>`,
    });

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }

  return res.status(StatusCodes.OK).json({
    msg: "Please check your email to reset password",
  });
};

//reset password
const resetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body;
  if (!token || !email || !newPassword) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all values" });
  }
  const user = await User.findOne({ email });

  if (user) {
    const currentDate = new Date();

    if (
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = newPassword;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }
  return res
    .status(StatusCodes.OK)
    .json({ msg: "your password is sucessfully reset" });
};

module.exports = {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
};
