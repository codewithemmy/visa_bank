const User = require("../models/User");
const fs = require("fs");

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

  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "mobi-bank",
    }
  );

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

module.exports = {
  updateProfile,
};
