const User = require("../../models/User");
const Contact = require("../../models/Contact");
const UserAccount = require("../../models/UserAccount");
const fs = require("fs");
require("../../utils/cloudinary");

//require cloudinary version 2
const cloudinary = require("cloudinary").v2;

//create user
const updateProfile = async (req, res) => {
  if (req.params.id) {
    const theProfile = await User.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json(theProfile);
  }
  return res.status(400).json({ msg: "unable to upate profile" });
};

// get profile
const getProfile = async (req, res) => {
  const profile = await User.find();
  return res.status(200).json(profile);
};

//get single profile
const getSingleProfile = async (req, res) => {
  const profile = await User.find({ _id: req.user.userId });
  return res.status(200).json(profile);
};

const createContact = async (req, res) => {
  const contact = await Contact.create(req.body);
  return res.status(200).json({
    msg: "Your message has been received, you will get a feed back as soon as possible",
    contact,
  });
};

const getAccount = async (req, res) => {
  const user = req.user.userId;
  if (user) {
    const getUserAccount = await UserAccount.find({ accountOwner: user });

    return res.status(200).json(getUserAccount);
  }

  return res.status(400).json({ msg: `error getting userAccount` });
};

const profileImageUpload = async (req, res) => {
  const image = req.files.image.tempFilePath;

  if (req.params.id) {
    const result = await cloudinary.uploader.upload(image, {
      use_filename: true,
      folder: "mobi-bank",
    });

    fs.unlinkSync(req.files.image.tempFilePath);
    const profile = await User.findByIdAndUpdate(
      { _id: req.params.id },
      { image: result.secure_url },
      { new: true, runValidators: true }
    );

    return res.status(200).json(profile);
  }
  return res.status(400).json({ msg: `unable to update image` });
};

module.exports = {
  updateProfile,
  createContact,
  getAccount,
  getProfile,
  profileImageUpload,
  getSingleProfile,
};
