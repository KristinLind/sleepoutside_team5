// [import] Bring in localStorage helpers and cart count updater
import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { updateCartCount } from "./cartCount.mjs";

const CART_KEY = "so-cart";

// [template] Render each cart item with image, name, qty, price, and remove button
function cartItemTemplate(item) {

  const imageSrc = `../${String(item.Image || "").replace(/^\/+/, "")}`;
  const priceEach = Number(item.Price || item.FinalPrice || item.ListPrice || 0);
  const qty = Number(item.Qty || item.qty || 1);
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

<<<<<<< HEAD
renderCartContents();
=======
// Add cart total display logic to cart page
function updateCartFooter(cartItems) {
  const footer = document.querySelector(".cart-footer");
  const totalSpan = document.getElementById("cart-total-value");

  if (!footer || !totalSpan) return;

  if (Array.isArray(cartItems) && cartItems.length > 0) {
    const total = cartItems.reduce((sum, item) => {
      const price = Number(item.Price || item.FinalPrice || item.ListPrice || 0);
      // NOTE: Using 'Qty' for consistency with ProductDetails.mjs
      const qty = Number(item.Qty || item.qty || 1);
      return sum + price * qty;
    }, 0);

    totalSpan.textContent = total.toFixed(2);
    footer.classList.remove("hide");
  } else {
    totalSpan.textContent = "0.00";
    footer.classList.add("hide");
  }
}

// Load cart items and display them in the list
function renderCartContents() {
  const list = document.querySelector(".product-list");
  if (!list) return;

  let cartItems = getLocalStorage(CART_KEY) || [];
  if (typeof cartItems === "string") {
    try { cartItems = JSON.parse(cartItems); } catch { cartItems = []; }
  }
  cartItems = Array.isArray(cartItems) ? cartItems : [];

  console.log("[cart] rendering items:", cartItems);

  // Hide cart total when cart is empty
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

// Remove item from cart and re-render
function onCartClick(e) {
  if (!e.target.classList.contains("remove-item")) return;
  const id = e.target.dataset.id;
  const cartItems = getLocalStorage(CART_KEY) || [];

  // Find the index of the item to be modified
  const itemIndex = cartItems.findIndex((item) => String(item.Id) === String(id));

  if (itemIndex > -1) {
    // Determine the current quantity 
    const currentQty = cartItems[itemIndex].Qty || 1;

    if (currentQty > 1) {
      // Decrement quantity by one
      cartItems[itemIndex].Qty = currentQty - 1;
    } else {
      // If quantity is 1 or less, remove the item entirely
      cartItems.splice(itemIndex, 1);
    }

    setLocalStorage(CART_KEY, cartItems);
    // Re-render the cart list and update the totals and badge count
    renderCartContents();
    updateCartCount();
  }
}

// Set up cart page on load
function initCartPage() {
  document.querySelector(".product-list")?.addEventListener("click", onCartClick);
  renderCartContents();
  updateCartCount();
}

document.addEventListener("DOMContentLoaded", initCartPage);
>>>>>>> 538cfc11c940191dc2c704ee59472fe3af27907a
