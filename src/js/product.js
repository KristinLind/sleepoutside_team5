import ProductData from "./ProductData.mjs";
import { getLocalStorage, setLocalStorage, qs } from "./utils.mjs";

const dataSource = new ProductData("tents");

//add products without overwriting previous cart
function addProductToCart(product) {
  const KEY = "so-cart";
  const current = getLocalStorage(KEY);
  const cart = Array.isArray(current) ? current : current ? [current] : [];
  cart.push(product);
  setLocalStorage(KEY, cart);
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
