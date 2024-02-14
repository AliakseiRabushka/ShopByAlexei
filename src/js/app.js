import Alpine from "../../node_modules/alpinejs/dist/module.esm.js";
window.Alpine = Alpine;

import {
  createStore,
  createEvent,
} from "https://cdn.jsdelivr.net/npm/effector/effector.mjs";

import { products } from "./products.js";

console.log("Console log message");

console.log(products);
const $products = createStore(products);

const addToCart = createEvent();
const removeFromCart = createEvent();
const updateCart = createEvent();

const $cart = createStore([])
  .on(addToCart, (state, item) => {
    let id = item.id;
    if (!state.find((item) => item.id == id)) {
      return [...state, item];
    }
    alert("Product has already been added to cart !");
    return [...state];
  })
  .on(removeFromCart, (item, id) => {
    let state = item.filter((item) => item.id !== id);
    return state;
  })
  .on(updateCart, (item, quantity) => {
    console.log(quantity);
  });

$cart.watch((state) => {
  console.log("state", state);
});

export const actions = {
  addToCart,
  removeFromCart,
  updateCart,
};

Alpine.store("products", {
  init() {
    this.products = products;
  },
});

Alpine.store("cart", {
  init() {
    this.actions = { addToCart, removeFromCart, updateCart };

    $cart.watch((store) => {
      this.store = store;
    });
  },
});

Alpine.start();
