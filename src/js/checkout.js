// checkout.js
import { setLocalStorage, loadHeaderFooter, alertMessage } from "./utils.mjs"; 
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

    const form = document.getElementById("checkout-form");
    if (!form.checkValidity()) {
      form.reportValidity(); 
      return; 
    }

    try {
      // Call the checkout method
      const orderResponse = await checkoutProcess.checkout(form);

      console.log("Server Response:", orderResponse);

      // Added Success Logic:
      setLocalStorage(CART_KEY, []); 
      sessionStorage.setItem("lastOrder", JSON.stringify(orderResponse.Result));
      window.location.href = "/checkout/confirmation.html"; 

    } catch (error) {
      console.error("Checkout failed:", error); // Log the error object

      if (error.name === 'servicesError' && error.message && error.message.message) {
        // Extract the specific message from the server
        const serverMessage = error.message.message;
        alertMessage(`Order submission failed: ${serverMessage}`, true);
      } else {
        // Fallback for network errors or unhandled error types
        alertMessage("An unknown error occurred during checkout. Please try again.");
      }
    }
  });
});