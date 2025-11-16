// src/js/cart.js

import { loadHeaderFooter, getLocalStorage, setLocalStorage, normalizePublicImage } from "./utils.mjs";
import { updateCartCount } from "./cartCount.mjs";
import { normalizeCartItems } from "./cartUtils.mjs";   // ← new import

const CART_KEY = "so-cart";

function cartItemTemplate(item) {
  const rawImagePath =
    item.Images?.PrimaryMedium ||
    item.Images?.PrimaryLarge ||
    item.Image ||
    "";

  const imageSrc = normalizePublicImage(rawImagePath);
  const fallback = normalizePublicImage("images/tents/placeholder-320.jpg");

  const lineTotal = (item.Price * item.Qty).toFixed(2);

  return `
    <li class="cart-card divider" data-id="${item.Id}">
      <a href="#" class="cart-card__image">
        <img src="${imageSrc}" alt="${item.Name}" loading="lazy"
        onerror="this.onerror=null;this.src='${fallback}'"/>
      </a>
      <a href="#"><h2 class="card__name">${item.Name}</h2></a>
      ${item.Color ? `<p class="cart-card__color">${item.Color}</p>` : ""}
      <p class="cart-card__quantity">qty: ${item.Qty}</p>
      <p class="cart-card__price">$${lineTotal}</p>
      <button class="remove-item" data-id="${item.Id}" aria-label="Remove ${item.Name}">Remove</button>
    </li>
  `;
}

function updateCartFooter(cartItems) {
  const footer = document.querySelector(".cart-footer");
  const totalSpan = document.getElementById("cart-total-value");
  if (!footer || !totalSpan) return;

  if (cartItems.length > 0) {
    const total = cartItems.reduce((sum, item) => sum + item.Price * item.Qty, 0);
    totalSpan.textContent = total.toFixed(2);
    footer.classList.remove("hide");
  } else {
    totalSpan.textContent = "0.00";
    footer.classList.add("hide");
  }
}

function renderCartContents() {
  const list = document.querySelector(".product-list");
  if (!list) return;

  let cartItems = getLocalStorage(CART_KEY) || [];
  if (typeof cartItems === "string") {
    try { cartItems = JSON.parse(cartItems); } catch { cartItems = []; }
  }
  cartItems = Array.isArray(cartItems) ? cartItems : [];

  // ✅ Normalize once here
  cartItems = normalizeCartItems(cartItems);

  if (cartItems.length === 0) {
    list.innerHTML = `<li class="cart-empty">Your cart is empty.</li>`;
    updateCartFooter([]);
    updateCartCount?.();
    return;
  }

  try {
    list.innerHTML = cartItems.map(cartItemTemplate).join("");
    updateCartFooter(cartItems);
  } catch (err) {
    console.error("[cart] render error:", err, { cartItems });
    list.innerHTML = `<li class="cart-error">Sorry, we couldn't render your cart.</li>`;
    updateCartFooter([]);
  }
}

function onCartClick(e) {
  if (!e.target.classList.contains("remove-item")) return;
  const id = e.target.dataset.id;
  let cartItems = getLocalStorage(CART_KEY) || [];

  // ✅ Normalize before modifying
  cartItems = normalizeCartItems(cartItems);

  const itemIndex = cartItems.findIndex(item => String(item.Id) === String(id));
  if (itemIndex > -1) {
    const currentQty = cartItems[itemIndex].Qty;
    if (currentQty > 1) {
      cartItems[itemIndex].Qty = currentQty - 1;
    } else {
      cartItems.splice(itemIndex, 1);
    }
    setLocalStorage(CART_KEY, cartItems);
    renderCartContents();
    updateCartCount();
  }
}

function initCartPage() {
  document.querySelector(".product-list")?.addEventListener("click", onCartClick);
  renderCartContents();
  updateCartCount();
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();
  initCartPage();
});
