// /src/js/main.js
import { updateCartCount } from "./cartCount.mjs";
import ProductData from "./ProductData.mjs";

function buildImgSrc(p) {
  const raw = String(p.Image || '').trim();

  if (/^https?:\/\//i.test(raw)) return raw;

  const onDeepPage =
    location.pathname.includes('/product_pages/') ||
    location.pathname.includes('/cart/');

  const prefix = onDeepPage ? '../' : './';

  if (raw.startsWith('../images/')) {
    return onDeepPage ? raw : raw.replace('../', './');
  }

  if (raw.startsWith('/images/')) return `.${raw}`;

  if (raw.startsWith('images/')) return `${prefix}${raw}`;

  return `${prefix}images/tents/${raw}`;
}


document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  loadProducts();
});
window.addEventListener("storage", updateCartCount);

async function loadProducts() {
  try {
    const dataSource = new ProductData("tents");
    const products = await dataSource.getData();

    const list = document.querySelector(".product-list");
    if (!list) return;

    const wanted = [
      { brand: "Marmot", name: "Ajax Tent - 3-Person, 3-Season" },
      { brand: "The North Face", name: "Talus Tent - 4-Person, 3-Season" },
      { brand: "The North Face", name: "Alpine Guide Tent - 3-Person, 4-Season" }, // <-- swap this in
      { brand: "Cedar Ridge", name: "Rimrock Tent - 2-Person, 3-Season" }
    ];

    const display = wanted
      .map(w => products.find(p => p.Brand?.Name === w.brand &&
                                   p.NameWithoutBrand === w.name &&
                                   !!p.Image))
      .filter(Boolean);

    list.innerHTML = display.map(productCardTemplate).join("");
  } catch (err) {
    console.error("Error loading products:", err);
  }
}

function productCardTemplate(p) {
  const price = Number.isFinite(+p.FinalPrice)
    ? `$${(+p.FinalPrice).toFixed(2)}`
    : `$${p.Price}`;

  const prefix =
    (location.pathname.includes('/product_pages/') || location.pathname.includes('/cart/'))
      ? '../'
      : './';
  const fallback = `${prefix}images/tents/placeholder-320.jpg`;

  return `
    <li class="product-card">
      <a href="product_pages/index.html?product=${p.Id}">
        <img
          src="${buildImgSrc(p)}"
          alt="${p.NameWithoutBrand || p.Name}"
          onerror="this.onerror=null;this.src='${fallback}'"
        >
        <h3 class="card__brand">${p.Brand?.Name ?? ''}</h3>
        <h2 class="card__name">${p.NameWithoutBrand || p.Name}</h2>
        <p class="product-card__price">${price}</p>
      </a>
    </li>
  `;
}


