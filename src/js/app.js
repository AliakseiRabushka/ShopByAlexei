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

const $lineItems = createStore([]);

sample({
  clock: addToCart,
  source: $lineItems,
  filter: ($lineItems, { id }) =>
    $lineItems.some((item) => item.id == id)
      ? alert("Product has already been added to cart !")
      : $lineItems,
  fn: (items, { id, quantity }) => {
    const item = products.find((item) => item.id == id);
    item.quantity = parseInt(quantity);
    item.sum = item.quantity * item.price;
    return [...items, item];
  },
  target: $lineItems,
});

sample({
  clock: removeFromCart,
  source: $lineItems,
  fn: (items, id) => items.filter((item) => item.id !== id),
  target: $lineItems,
});

sample({
  clock: updatePurchaseQuantity,
  source: $lineItems,
  fn: (items, { id, quantity }) => {
    const updateLineItems = [];
    items.forEach((item) => {
      if (item.id == id) {
        item.quantity = parseInt(quantity);
        item.sum = quantity * item.price;
      }
      updateLineItems.push(item);
    });
    return updateLineItems;
  },
  target: $lineItems,
});

const $calculateSum = sample({
  clock: $lineItems,
  sourse: $lineItems,
  fn: (items) => {
    const totalSumItems = items.reduce((sum, current) => {
      return sum + current.sum;
    }, 0);
    return totalSumItems;
  },
});

const $calculateQuantity = sample({
  clock: $lineItems,
  sourse: $lineItems,
  fn: (items) => {
    let totalNumberItems = 0;
    items.map((item) => {
      totalNumberItems += item.quantity;
    });
    return totalNumberItems;
  },
});

const stores = {
  $lineItems,
  $calculateSum,
  $calculateQuantity,
};

$lineItems.watch((state) => {
  console.log("lineItems", state);
});

export const store = combine(stores);

export const actions = {
  addToCart,
  removeFromCart,
  updatePurchaseQuantity,
};
