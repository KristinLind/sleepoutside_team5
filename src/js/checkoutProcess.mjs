import { getLocalStorage } from "./utils.mjs";
import { normalizeCartItems } from "./cartUtils.mjs";

const CART_KEY = "so-cart";

export default class CheckoutProcess {
  constructor(cartKey = CART_KEY) {
    this.cartKey = cartKey;
    const rawItems = getLocalStorage(this.cartKey) || [];
    this.cartItems = normalizeCartItems(rawItems); // ✅ normalized once
  }

  calculateSubtotal() {
    return this.cartItems.reduce((sum, item) => sum + item.Price * item.Qty, 0);
  }

  calculateTotals() {
    const subtotal = this.calculateSubtotal();
    const tax = subtotal * 0.06;
    const itemCount = this.cartItems.reduce((count, item) => count + item.Qty, 0);
    const shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
    const total = subtotal + tax + shipping;
    return { subtotal, tax, shipping, total };
  }
}
