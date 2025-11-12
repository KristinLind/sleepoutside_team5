// /src/js/home.js
import ProductData from "./ProductData.mjs";

function productCardTemplate(p) {
  const price = Number.isFinite(+p.FinalPrice) ? `$${(+p.FinalPrice).toFixed(2)}` : p.FinalPrice;
  const img = String(p.Image || "").replace(/^\/+/, "");
  return `
    <li class="product-card">
      <a href="product_pages/index.html?product=${p.Id}">
        <img src="${img}" alt="${p.NameWithoutBrand}" />
        <h3 class="card__brand">${p.Brand?.Name ?? ""}</h3>
        <h2 class="card__name">${p.NameWithoutBrand}</h2>
        <p class="product-card__price">${price}</p>
      </a>
    </li>
  `;
}

async function init() {
  const listEl = document.querySelector(".product-list");
  if (!listEl) return;

  const ds = new ProductData("tents");
  const products = await ds.getData();
  listEl.innerHTML = products.map(productCardTemplate).join("");
}

document.addEventListener("DOMContentLoaded", init);
