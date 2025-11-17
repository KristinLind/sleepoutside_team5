import { getLocalStorage } from "./utils.mjs";
import { normalizeCartItems } from "./cartUtils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const CART_KEY = "so-cart";

// Helper function 1: Convert form element to a simple JS object
function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

// Helper function 2: Package items for the server (Step 6)
function packageItems(items) {
  // Convert the detailed cart items into the simple format required by the server
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.Price,
    quantity: item.Qty,
  }));
}


export default class CheckoutProcess {
  constructor(cartKey = CART_KEY, outputSelector = ".order-summary") {
    this.cartKey = cartKey;
    const rawItems = getLocalStorage(this.cartKey) || [];
    this.cartItems = normalizeCartItems(rawItems);
    this.outputSelector = outputSelector;
    this.services = new ExternalServices();

    // Initialize properties for tracking totals
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.calculateAndDisplaySubtotal();
  }

  calculateSubtotal() {
    return this.cartItems.reduce((sum, item) => sum + item.Price * item.Qty, 0);
  }

  calculateAndDisplaySubtotal() {
    this.itemTotal = this.calculateSubtotal();
    const subtotalEl = document.querySelector(`${this.outputSelector} #subtotal`);
    if (subtotalEl) {
      subtotalEl.innerText = `${this.itemTotal.toFixed(2)}`;
    }
  }

  // 5. Calculate and display the full order totals
  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;
    const itemCount = this.cartItems.reduce((count, item) => count + item.Qty, 0);
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const taxEl = document.querySelector(`${this.outputSelector} #tax`);
    const shippingEl = document.querySelector(`${this.outputSelector} #shipping`);
    const totalEl = document.querySelector(`${this.outputSelector} #orderTotal`);

    if (taxEl) taxEl.innerText = this.tax.toFixed(2);
    if (shippingEl) shippingEl.innerText = this.shipping.toFixed(2);
    if (totalEl) totalEl.innerText = this.orderTotal.toFixed(2);
  }


  // 6. Final Checkout Function
  async checkout(formElement) {
    // 1. Ensure all final totals are calculated (including shipping/tax based on zip code input)
    this.calculateOrderTotal();

    // 2. Convert form data to JSON object
    const formObject = formDataToJSON(formElement);

    // 3. Prepare the order items list
    const items = packageItems(this.cartItems);

    // 4. Combine all data into the server-required payload format
    const payload = {
      // Form Data: Ensure these keys (fname, lname, etc.) match the server's requirements!
      fname: formObject.fname,
      lname: formObject.lname,
      street: formObject.street,
      city: formObject.city,
      state: formObject.state,
      zip: formObject.zip,
      cardNumber: formObject.cardNumber,
      expiration: formObject.expiration,
      code: formObject.code,

      // Calculated/Internal Data
      orderDate: new Date().toISOString(),
      items: items,
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping,
      tax: this.tax.toFixed(2),
    };

    // 5. Call the external service to submit the order
    try {
      const response = await this.services.checkout(payload);
      return response;
    } catch (error) {
      console.error("Checkout Failed in CheckoutProcess:", error);
      throw error; 
    }
  }
}
