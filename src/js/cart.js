import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const list = document.querySelector(".product-list");
  if (!list) return;

  if (!cartItems.length) {
    list.innerHTML = `<li class="cart-empty">Your cart is empty.</li>`;
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  list.innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const color = item?.Colors?.[0]?.ColorName ?? "";
  const imageSrc = item?.Image?.startsWith("/") ? item.Image : `/${item.Image}`;

  const newItem = `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${imageSrc}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      ${color ? `<p class="cart-card__color">${color}</p>` : ""}
      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
    </li>
  `;
  return newItem;
}

renderCartContents();
