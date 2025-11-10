import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { updateCartCount } from "./cartCount.mjs";

const CART_KEY = "so-cart";

function cartItemTemplate(item) {
  const imageSrc = `../${String(item.Image || "").replace(/^\/+/, "")}`;
  const priceEach = Number(item.Price) || 0;
  const qty = Number(item.Qty) || 1;
  const lineTotal = (priceEach * qty).toFixed(2);

  return `
    <li class="cart-card divider" data-id="${item.Id}">
      <a href="#" class="cart-card__image">
        <img src="${imageSrc}" alt="${item.Name}" />
      </a>
      <a href="#"><h2 class="card__name">${item.Name}</h2></a>
      ${item.Color ? `<p class="cart-card__color">${item.Color}</p>` : ""}
      <p class="cart-card__quantity">qty: ${qty}</p>
      <p class="cart-card__price">$${lineTotal}</p>
      <button class="remove-item" data-id="${item.Id}" aria-label="Remove ${item.Name}">Remove</button>
    </li>
  `;
}

function renderCartContents() {
  const list = document.querySelector(".product-list");
  if (!list) return;

  let cartItems = getLocalStorage(CART_KEY) || [];
  if (typeof cartItems === "string") {
    try { cartItems = JSON.parse(cartItems); } catch { cartItems = []; }
  }
  cartItems = Array.isArray(cartItems) ? cartItems : [];

  console.log("[cart] rendering items:", cartItems);

  if (cartItems.length === 0) {
    list.innerHTML = `<li class="cart-empty">Your cart is empty.</li>`;
    updateCartCount?.();
    return;
  }

  try {
    list.innerHTML = cartItems.map(cartItemTemplate).join("");
  } catch (err) {
    console.error("[cart] render error:", err, { cartItems });
    list.innerHTML = `<li class="cart-error">Sorry, we couldn’t render your cart.</li>`;
  }
}

function onCartClick(e) {
  if (!e.target.classList.contains("remove-item")) return;
  const id = e.target.dataset.id;
  const cartItems = getLocalStorage(CART_KEY) || [];
  const updated = cartItems.filter((item) => String(item.Id) !== String(id));
  setLocalStorage(CART_KEY, updated);
  renderCartContents();
  updateCartCount();
}

function initCartPage() {
  document.querySelector(".product-list")?.addEventListener("click", onCartClick);
  renderCartContents();
  updateCartCount();
}

document.addEventListener("DOMContentLoaded", initCartPage);
