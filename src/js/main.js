// /src/js/main.js
import ProductData from "./ProductData.mjs";
import { updateCartCount } from "./cartCount.mjs";
import { normalizePublicImage } from "./utils.mjs"; 
import Alert from "./Alert.js";

const alertInstance = new Alert();
alertInstance.init();

const list = document.querySelector(".product-list");
if (!list) {
  console.warn("[main] .product-list not found");
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
      { brand: "The North Face", name: "Alpine Guide Tent - 3-Person, 4-Season" },
      { brand: "Cedar Ridge", name: "Rimrock Tent - 2-Person, 3-Season" }
    ];

    const display = wanted
      .map(w =>
        products.find(
          p => p.Brand?.Name === w.brand &&
            p.NameWithoutBrand === w.name &&
            !!p.Image
        )
      )
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

  const productHref = `./product_pages/index.html?product=${p.Id}`;

  const imgSrc = normalizePublicImage(p.Image);
  const fallback = normalizePublicImage("images/tents/placeholder-320.jpg");

  return `
    <li class="product-card">
      <a href="${productHref}">
        <img
          src="${imgSrc}"
          alt="${p.NameWithoutBrand || p.Name}"
          onerror="this.onerror=null;this.src='${fallback}'"
        >
        <h3 class="card__brand">${p.Brand?.Name ?? ""}</h3>
        <h2 class="card__name">${p.NameWithoutBrand || p.Name}</h2>
        <p class="product-card__price">${price}</p>
      </a>
    </li>
  `;
}



