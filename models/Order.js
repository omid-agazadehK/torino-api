const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const orderSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: "pending",
    },
    // هر فیلد دیگه‌ای که میخوای داخل order
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

// ---------- فانکشن‌ها همون قبلی ----------

const getAllOrders = async () => {
  return await Order.find();
};

const getOrderById = async (id) => {
  return await Order.findOne({ id });
};

const getOrderByUserId = async (userId) => {
  return await Order.findOne({ userId });
};

const getOrdersByUserId = async (userId) => {
  return await Order.find({ userId });
};

const createOrder = async (orderData) => {
  const newOrder = new Order({ ...orderData, id: uuidv4(), createdAt: new Date() });
  return await newOrder.save();
};

const updateOrder = async (id, updatedData) => {
  return await Order.findOneAndUpdate({ id }, updatedData, { new: true });
};

const deleteOrder = async (id) => {
  return await Order.findOneAndDelete({ id });
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