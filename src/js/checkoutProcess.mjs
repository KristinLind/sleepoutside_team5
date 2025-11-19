// CheckoutProcess.mjs file

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

// Helper function 2: Package items for the server
function packageItems(items) {
  return items.map((item) => ({
    id: item.id,        // ✅ lowercase keys
    name: item.name,
    price: item.price,
    quantity: item.qty,
  }));
}

export default class CheckoutProcess {
  constructor(cartKey = CART_KEY, outputSelector = ".order-summary") {
    this.cartKey = cartKey;
    const rawItems = getLocalStorage(this.cartKey) || [];
    this.cartItems = normalizeCartItems(rawItems);
    this.outputSelector = outputSelector;
    this.services = new ExternalServices();

    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.calculateAndDisplaySubtotal();
    this.calculateOrderTotal();  
  }

  calculateSubtotal() {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  calculateAndDisplaySubtotal() {
    this.itemTotal = this.calculateSubtotal();
    const subtotalEl = document.querySelector(`${this.outputSelector} #subtotal`);
    if (subtotalEl) {
      subtotalEl.innerText = `${this.itemTotal.toFixed(2)}`;
    }
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;
    const itemCount = this.cartItems.reduce((count, item) => count + item.qty, 0);
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

  // ✅ Corrected Checkout Function
  async checkout(formElement) {
    this.calculateOrderTotal();

    const formObject = formDataToJSON(formElement);
    const items = packageItems(this.cartItems);

    const payload = {
      // ✅ Correct field names for backend
      fname: formObject.fname,
      lname: formObject.lname,
      street: formObject.street,
      city: formObject.city,
      state: formObject.state,
      zip: formObject.zip,
      cardNumber: formObject.cardNumber,
      expiration: formObject.expiration,
      code: formObject.code,

      orderDate: new Date().toISOString(),
      items: items,
      orderTotal: parseFloat(this.orderTotal.toFixed(2)),
      shipping: parseFloat(this.shipping.toFixed(2)),
      tax: parseFloat(this.tax.toFixed(2)),
    };

    return await this.services.checkout(payload);
  }
}
