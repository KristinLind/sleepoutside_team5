// src/js/cartCount.mjs
import { getLocalStorage } from "./utils.mjs";

const CART_KEY = "so-cart";

export function updateCartCount() {
  const items = getLocalStorage(CART_KEY) || [];   // <- use the helper
  const count = items.reduce((sum, i) => sum + (i.Qty ?? 1), 0);

  const badge = document.getElementById('cart-count');
  if (!badge) return;

  if (count > 0) {
    badge.textContent = count;
    badge.classList.remove('hidden');
  } else {
    badge.textContent = '';
    badge.classList.add('hidden');
  }
}



