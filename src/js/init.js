import Alpine from "../../node_modules/alpinejs/dist/module.esm.js";
import { actions, store } from "./app.js";
import { products } from "./products.mjs";

window.Alpine = Alpine;

console.log(products);

Alpine.data("products", function goods() {
  return {
    products: products,
  };
});

Alpine.store("cart", {
  init() {
    this.actions = actions;

    store.watch((store) => {
      this.store = store;
    });
  },
  getSubTotal(data) {
    return data.quantity * data.price;
  },
});

Alpine.start();
