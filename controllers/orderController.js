const Order = require("../models/Order");
const Tour = require("../models/Tour");
const Basket = require("../models/Basket");
const Transaction = require("../models/Transaction");

exports.createOrder = async (req, res) => {
  const { nationalCode, fullName, gender, birthDate } = req.body;

  // گرفتن سبد خرید
  let basket = await Basket.getFromBasket(); // الان Mongoose برگشت میده

  if (!basket?.length) {
    return res.status(404).json({ message: "سبد خرید شما خالی است" });
  }

  const tourId = basket[0].tourData._id; // همون اولین آیتم سبد

  if (!nationalCode || !fullName || !gender || !birthDate) {
    return res.status(400).json({ message: "تمامی فیلدهای ضروری را پر کنید!" });
  }

  try {
    // Validate tour
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: "تور درخواستی یافت نشد!" });
    }

    // Check seat availability
    if (tour.availableSeats <= 0) {
      return res.status(400).json({ message: "ظرفیت تور پر است!" });
    }

    // Create order
    const orderData = {
      userId: req.user._id,
      tourId,
      nationalCode,
      fullName,
      gender,
      birthDate: new Date(birthDate),
      createdAt: new Date(),
    };
    const order = await Order.createOrder(orderData);

    // Create transaction
    const transactionData = {
      userId: req.user._id,
      amount: tour.price,
      type: "Purchase",
      createdAt: new Date(),
    };
    const transaction = await Transaction.createTransaction(transactionData);

    // Update tour seats
    await Tour.findByIdAndUpdate(tourId, {
      availableSeats: tour.availableSeats - 1,
    });

    // خالی کردن سبد (یا آپدیت کردن)
    await Basket.addToBasket({}); // همون فانکشن موجود، میتونی بعداً کنترلش کنی

    res.json({ message: "تور با موفقیت خریداری شد." });
  } catch (err) {
    console.error("Error in createOrder:", err.message);
    res.status(500).json({ message: "خطا در ایجاد سفارش." });
  }
};
