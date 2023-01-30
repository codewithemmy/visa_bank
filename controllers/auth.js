const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const createHash = require("../utils/createHash");
const crypto = require("crypto");
const { mailTransport } = require("../utils/sendEmail");

//sign up user
const signup = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `All fields should be filled` });
  }

  const emailExist = await User.findOne({ email });
  if (emailExist) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "email already exist" });
  }

  const user = await User.create({
    username: username,
    email: email,
    password: password,
    role,
  });

  //send Mail
  mailTransport.sendMail({
    from: '"Mobi-Bank" <VisaBank@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "REGISTRATION SUCCESSFUL", // Subject line
    html: `Hello, ${username}, You have successfully registered with MobiBank, Welcome on board</h4>`, // html body
  });

  return res.status(StatusCodes.CREATED).json(user);
};

//user login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Please provide username or password" });
  }
  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Invalid username or password" });
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Password is not valid" });
  }

  let token = user.createJWT({
    userId: user._id,
    username: user.username,
    email: user.email,
  });

  return res
    .status(StatusCodes.OK)
    .json({ msg: "Login Successful", user, token: token });
};

//logout
const logout = async (req, res) => {
  const user = req.user;
  if (user) {
    delete req.headers.authorization;

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
