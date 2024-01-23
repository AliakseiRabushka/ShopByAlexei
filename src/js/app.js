import Alpine from "../../node_modules/alpinejs/dist/module.esm.js";
window.Alpine = Alpine;
Alpine.start();
import {
  createStore,
  createEffect,
  sample,
} from "../../node_modules/effector/effector.mjs";
console.log("Console log message");

const $counter = createStore(0);
const increaseByOne = createEffect();

setInterval(() => {
  increaseByOne();
}, 2000);

sample({
  clock: increaseByOne,
  source: $counter,
  fn: (counter) => {
    console.log("Counter", counter);
    return counter + 1;
  },
  target: $counter,
});
