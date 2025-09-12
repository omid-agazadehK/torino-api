const mongoose = require("mongoose");

const basketSchema = new mongoose.Schema({
  tourData: {
    type: Object,
    required: true,
  },
});

const Basket = mongoose.model("Basket", basketSchema);

async function addToBasket(TourData) {
  const basket = new Basket({ tourData: TourData });
  return await basket.save();
}

async function getFromBasket() {
  const baskets = await Basket.find();
  return baskets[baskets.length - 1]; // آخرین رکورد
}

module.exports = {
  addToBasket,
  getFromBasket,
};
