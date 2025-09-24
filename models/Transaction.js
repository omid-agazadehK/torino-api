const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  orderId: { type: String },
  amount: { type: Number },
  type: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

const getAllTransactions = async () => {
  return await Transaction.find({});
};

const getTransactionsByUserId = async (id) => {
  return await Transaction.find({ userId: id });
};

const createTransaction = async (transactionData) => {
  const newTransaction = new Transaction({
    ...transactionData,
    createdAt: new Date(),
  });
  return await newTransaction.save();
};

const updateTransaction = async (id, updatedData) => {
  return await Transaction.findByIdAndUpdate(id, updatedData, { new: true });
};

const deleteTransaction = async (id) => {
  return await Transaction.findByIdAndDelete(id);
};

module.exports = {
  getAllTransactions,
  getTransactionsByUserId,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
