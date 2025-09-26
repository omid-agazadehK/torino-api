const Order = require("../models/Order");
const Tour = require("../models/Tour");
const Basket = require("../models/Basket");
const Transaction = require("../models/Transaction");
const UserModel = require("../models/User");
exports.createOrder = async (req, res) => {
  const { nationalCode, fullName, gender, birthDate } = req.body;

  const basket = await Basket.getFromBasket(); // آخرین سند
  if (!basket)
    return res.status(404).json({ message: "سبد خرید شما خالی است" });

  const tourId = basket.tourData.id;

  if (!nationalCode || !fullName || !gender || !birthDate) {
    return res.status(400).json({ message: "تمامی فیلدهای ضروری را پر کنید!" });
  }

  try {
    const tour = await Tour.getTourById(tourId);
    if (!tour)
      return res.status(404).json({ message: "تور درخواستی یافت نشد!" });
    if (tour.availableSeats <= 0)
      return res.status(400).json({ message: "ظرفیت تور پر است!" });

    const orderData = {
      user: req.user._id, // ✅ باید اسمش همونی باشه که توی اسکیمای Order نوشتی
      tour: tourId, // ✅
      nationalCode,
      fullName,
      gender,
      birthDate: new Date(birthDate),
    };
    const order = await Order.createOrder(orderData);

    const user = await UserModel.getUserById(req.user._id);
    if (user) {
      user.tours.push(tourId); // UUID تور یا ObjectId
      await UserModel.updateUser(user._id, { tours: user.tours });
    }
    await Transaction.createTransaction({
      userId: req.user._id,
      orderId: order._id,
      type: "Purchase",
      amount: tour.price,
    });

    await Tour.updateTour(tourId, { availableSeats: tour.availableSeats - 1 });

    // پاک کردن آخرین سبد
    await Basket.deleteBasket(basket._id); // فانکشن deleteBasket بساز که یک سبد رو پاک کنه

    res.json({ message: "تور با موفقیت خریداری شد.", order });
  } catch (err) {
    console.error("Error in createOrder:", err.message);
    res.status(500).json({ message: "خطا در ایجاد سفارش." });
  }
};
