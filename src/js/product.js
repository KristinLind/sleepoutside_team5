// Product.js file 

import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { updateCartCount } from "./cartCount.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  updateCartCount();

  const productID = new URLSearchParams(window.location.search).get("product");
  if (!productID) {
    console.error("No product ID found in URL");
    return;
  }

  // ✅ Instantiate without category
  const dataSource = new ProductData();

  // ✅ ProductDetails should now use findProductById(id) internally
  const details = new ProductDetails(productID, dataSource);
  details.init();
});
