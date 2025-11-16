// checkout.js
import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { normalizeCartItems } from "./cartUtils.mjs";   // ✅ new import

const CART_KEY = "so-cart";

document.addEventListener("DOMContentLoaded", () => {
  let cartItems = getLocalStorage(CART_KEY) || [];
  cartItems = normalizeCartItems(cartItems);            // ✅ normalize before use
  updateOrderSummary(cartItems);

  const form = document.getElementById("checkout-form");
  form.addEventListener("submit", (e) => {
    if (!form.checkValidity()) {
      e.preventDefault();
      alert("Please fill out all required fields.");
    } else {
      e.preventDefault();
      alert("Order placed successfully!");

      // ✅ Save normalized items for confirmation page
      sessionStorage.setItem("lastOrder", JSON.stringify(cartItems));

      // ✅ Clear cart after checkout
      setLocalStorage(CART_KEY, []);

      // ✅ Redirect to confirmation page
      window.location.href = "/checkout/confirmation.html";
    }
  });
});

function updateOrderSummary(cartItems) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.Price * item.Qty, 0);
  const tax = subtotal * 0.06;
  const itemCount = cartItems.reduce((count, item) => count + item.Qty, 0);
  const shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
  const total = subtotal + tax + shipping;

  document.getElementById("summary-subtotal").textContent = subtotal.toFixed(2);
  document.getElementById("summary-tax").textContent = tax.toFixed(2);
  document.getElementById("summary-shipping").textContent = shipping.toFixed(2);
  document.getElementById("summary-total").textContent = total.toFixed(2);
}
