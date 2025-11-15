// /src/js/product.js
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { updateCartCount } from "./cartCount.mjs";
import { loadHeaderFooter } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();

  updateCartCount();

  const params = new URLSearchParams(window.location.search);
  const productID = params.get("product");

  if (!productID) {
    console.error("No product ID found in URL");
    return;
  }
  
  const dataSource = new ProductData();           // category handled inside
  const details = new ProductDetails(productID, dataSource);
  details.init();
});

