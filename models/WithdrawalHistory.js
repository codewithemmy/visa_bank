const mongoose = require("mongoose");

const WithdrawalHistorySchema = new mongoose.Schema(
  {
    accountOwner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    transactionType: {
      type: String,
    },
    accountNo: {
      type: String,
    },
    date: {
      type: Date,
    },
    amount: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WithdrawalHistory", WithdrawalHistorySchema);
