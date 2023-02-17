const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    accountNo: { type: String },
    username: {
      type: String,
      minlength: 3,
      maxlength: 30,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "please provide a valid emailF",
      },
    },
    firstName: { type: String },
    lastName: { type: String },
    state: { type: String },
    city: { type: String },
    address: { type: String },
    image: { type: String },
    zipCode: { type: Number },
    country: { type: String },
    mobile: { type: String },
    password: { type: String, required: true },
    passwordToken: {
      type: String,
    },
    role: { type: String, enum: ["super-admin", "user"], default: "user" },
    passwordTokenExpirationDate: {
      type: Date,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password,
          delete ret.__v,
          delete ret.createdAt,
          delete ret.updatedAt;
        delete ret.verificationToken;
      },
    },
    timestamps: true,
  }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = () => {
  return jwt.sign(
    {
      userId: this._id,
      username: this.username,
      email: this.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
