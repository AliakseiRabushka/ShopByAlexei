import {
  createStore,
  createEvent,
  combine,
  sample,
} from "https://cdn.jsdelivr.net/npm/effector/effector.mjs";
import { products } from "./products.mjs";

const addToCart = createEvent();
const removeFromCart = createEvent();
const updatePurchaseQuantity = createEvent();

const $cart = createStore([]);

sample({
  clock: addToCart,
  source: $cart,
  fn: (items, params) => {
    const item = products.find((item) => item.id == params.id);
    item.quantity = params.quantity;
    item.sum = item.quantity * item.price;
    if (!items.find((i) => i.id == item.id)) {
      return [...items, item];
    }
    alert("Product has already been added to cart !");
  },
  target: $cart,
});

sample({
  clock: removeFromCart,
  source: $cart,
  fn: (items, id) => {
    items = items.filter((item) => item.id !== id);
    return items;
  },
  target: $cart,
});

sample({
  clock: updatePurchaseQuantity,
  source: $cart,
  fn: (items, params) => {
    items.map((item) => {
      if (item.id == params.id) {
        item.quantity = params.quantity;
        item.sum = params.quantity * item.price;
      }
    });
    console.log("updatePurchaseQuantity", items);
    return items;
  },
  target: $cart,
});

const $counterSumAndQuantity = sample({
  clock: $cart,
  sourse: $cart,
  fn: (items) => {
    const totalSumItems = items.reduce(function (sum, current) {
      return sum + current.sum;
    }, 0);
    const totalNumberItems = items.reduce(function (sum, current) {
      return sum + parseInt(current.quantity);
    }, 0);
    return { totalSum: totalSumItems, totalQuantity: totalNumberItems };
  },
});

const stores = {
  $cart,
  $counterSumAndQuantity,
};

$cart.watch((state) => {
  console.log("state", state);
});

$counterSumAndQuantity.watch((state) => {
  console.log("state", state);
});

export const store = combine(stores);

export const actions = {
  addToCart,
  removeFromCart,
  updatePurchaseQuantity,
};
