import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { updateCartCount } from "./cartCount.mjs";


document.addEventListener("DOMContentLoaded", async () => {
  updateCartCount();

  const productID = new URLSearchParams(window.location.search).get("product");
  if (!productID) return;

  const dataSource = new ProductData("tents");
  const details = new ProductDetails(productID, dataSource);
  details.init();
});

