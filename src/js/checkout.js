// checkout.js

import { loadHeaderFooter, alertMessage } from "./utils.mjs";
import CheckoutProcess from "./checkoutProcess.mjs";

const CART_KEY = "so-cart";

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();

  const checkoutProcess = new CheckoutProcess(CART_KEY, ".order-summary");
  checkoutProcess.init();

  const form = document.getElementById("checkout-form");

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

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    try {
      const orderResponse = await checkoutProcess.checkout(form);
      console.log("Server Response:", orderResponse);

      // Clear cart
      localStorage.removeItem(CART_KEY);

      // Save last order
      sessionStorage.setItem("lastOrder", JSON.stringify(orderResponse));

      // Redirect to success page (correct folder path)
      window.location.href = "/checkout/success.html";

    } catch (error) {
      console.error("Checkout failed:", error);

      if (error.name === 'servicesError') {
        let errorMessage = "Order submission failed. Please correct the following errors:";

        const validationErrors = error.details;
        // Check if we have specific field validation errors
        if (validationErrors) {
          // build a list for specific errors
          for (const key in validationErrors) {
            // Append each error message on a new line
            errorMessage += `<br>- ${validationErrors[key]}`;
          }
        } else {
          // Fallback for general services error is details are missing.
          errorMessage = error.message;
        }
        alertMessage(errorMessage, true);
      } else {
        alertMessage("An unknown error occured during checkout.Please try again.");
      }
    }
  });
});
