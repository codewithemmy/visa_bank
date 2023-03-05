const User = require("../models/User");
const Contact = require("../models/Contact");
const UserAccount = require('../models/UserAccount')
const fs = require("fs");
require("../utils/cloudinary");

//require cloudinary version 2
const cloudinary = require("cloudinary").v2;

//create user
const updateProfile = async (req, res) => {
  const { id: profileId } = req.params;

  if (!profileId) {
    return res.status(400).json({ msg: `there is no id on the params` });
  }
  const {
    email,
    firstName,
    lastName,
    state,
    city,
    address,
    zipCode,
    country,
    mobile,
  } = req.body;

  const image = req.files.image.tempFilePath;

  const result = await cloudinary.uploader.upload(image, {
    use_filename: true,
    folder: "mobi-bank",
  });

  fs.unlinkSync(req.files.image.tempFilePath);

  const profile = await User.findByIdAndUpdate(
    { _id: profileId },
    {
      email,
      firstName,
      lastName,
      state,
      city,
      address,
      zipCode,
      country,
      mobile,
      image: result.secure_url,
    },
    { new: true, runValidators: true }
  );
  return res.status(201).json(profile);
};

const getProfile = async (req, res) => {
  const profile = await User.find();
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

module.exports = {
  updateProfile,
  createContact,
  getAccount,
  getProfile,
};
