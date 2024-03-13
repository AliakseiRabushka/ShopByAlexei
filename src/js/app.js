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
  filter: (lineItems, { id }) => lineItems.every((item) => item.id !== id),
  fn: (items, { id, quantity }) => {
    const item = products.find((item) => item.id == id);
    const itemForCart = { ...item, quantity: parseInt(quantity) };
    return [...items, itemForCart];
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
    return items.map((item) => {
      if (item.id == id) {
        return { ...item, quantity: parseInt(quantity) };
      }
      return item;
    });
  },
  target: $lineItems,
});

const $totalSum = sample({
  clock: $lineItems,
  sourse: $lineItems,
  fn: (items) => {
    const totalSumItems = items.reduce((sum, current) => {
      return sum + current.price * current.quantity;
    }, 0);
    return totalSumItems;
  },
});

const $totalQuantity = sample({
  clock: $lineItems,
  sourse: $lineItems,
  fn: (items) => {
    const totalNumberItems = items.reduce((sum, current) => {
      return sum + current.quantity;
    }, 0);
    return totalNumberItems;
  },
});

const stores = {
  $lineItems,
  $totalSum,
  $totalQuantity,
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
