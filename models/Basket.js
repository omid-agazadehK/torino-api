const mongoose = require("mongoose");

const basketSchema = new mongoose.Schema({
  tourData: {
    type: Object,
    required: true,
  },
});

const Basket = mongoose.model("Basket", basketSchema);

async function addToBasket(TourData) {
  const baskets = new Basket({ tourData: TourData });
  return baskets[baskets.length - 1];
}

async function getFromBasket() {
  return await Basket.find();
}

module.exports = {
  addToBasket,
  getFromBasket,
};
