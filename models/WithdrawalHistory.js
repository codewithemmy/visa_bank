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
    amount: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WithdrawalHistory", WithdrawalHistorySchema);
