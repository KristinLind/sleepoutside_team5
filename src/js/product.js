// /src/js/product.js
import ExternalServices from "./ExternalServices.mjs";
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
  
  const dataSource = new ExternalServices();           // category handled inside
  const details = new ProductDetails(productID, dataSource);
  details.init();
});

