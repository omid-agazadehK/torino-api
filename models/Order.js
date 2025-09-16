const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    nationalCode: { type: String, required: true },
    fullName: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    birthDate: { type: Date, required: true },
  },
  { timestamps: true } // createdAt و updatedAt خودکار ساخته میشن
);

const Order = mongoose.model("Order", orderSchema);

// ---------- فانکشن‌های CRUD ----------

const getAllOrders = async () => Order.find();

const getOrderById = async (_id) => Order.findById(_id);

const getOrderByUserId = async (userId) => Order.findOne({ userId });

const getOrdersByUserId = async (userId) => Order.find({ userId });

const createOrder = async (orderData) => {
  const newOrder = new Order(orderData);
  return await newOrder.save();
};

const updateOrder = async (_id, updatedData) => {
  return await Order.findByIdAndUpdate(_id, updatedData, { new: true });
};

const deleteOrder = async (_id) => {
  return await Order.findByIdAndDelete(_id);
};

module.exports = {
  getAllOrders,
  getOrderById,
  getOrderByUserId,
  getOrdersByUserId,
  createOrder,
  updateOrder,
  deleteOrder,
};
