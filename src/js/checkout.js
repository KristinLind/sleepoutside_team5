// checkout.js
import { setLocalStorage, loadHeaderFooter } from "./utils.mjs"; 
import CheckoutProcess from "./checkoutProcess.mjs";


const CART_KEY = "so-cart";

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();

  // Instantiate the Checkout Process
  const checkoutProcess = new CheckoutProcess(CART_KEY, ".order-summary");
  checkoutProcess.init(); // Display initial subtotal

  const form = document.getElementById("checkout-form"); 
  // Optional: Update totals when the zip code changes.
  const zipCodeInput = form.querySelector('#zipCode');
  if (zipCodeInput) {
    zipCodeInput.addEventListener('blur', () => {
      if (zipCodeInput.value.trim() !== '') {
        checkoutProcess.calculateOrderTotal();
      }
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); 
    // Basic form validation check
    if (!form.checkValidity()) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      // Call the checkout method
      const orderResponse = await checkoutProcess.checkout(form);

      console.log("Server Response:", orderResponse);

      // Added Success Logic:
      setLocalStorage(CART_KEY, []); 
      sessionStorage.setItem("lastOrder", JSON.stringify(orderResponse.Result)); // Save the response if needed for confirmation page
      window.location.href = "/checkout/confirmation.html"; 
      
    } catch (error) {
      // Handle server/network errors
      alert("Order submission failed. See console for details.");
    }
  });
});