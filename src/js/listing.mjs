import ProductData from "./ProductData.mjs";

function productCardTemplate(p) {
  const brand = p.Brand?.Name ?? p.Brand ?? "";
  const name = p.NameWithoutBrand ?? p.Name ?? "";
  const img = p.Images?.PrimaryLarge || p.Image || "";
  const price = Number.isFinite(+p.FinalPrice)
    ? `$${(+p.FinalPrice).toFixed(2)}`
    : (p.FinalPrice ?? p.SuggestedRetailPrice ?? "");

  // IMPORTANT: link to ONE details page with a URL param
  const href = `/product_pages/index.html?product=${encodeURIComponent(p.Id)}`;

  return `
    <li class="product-card">
      <a href="${href}">
        <img src="${img}" alt="${name}" loading="lazy">
        <h3 class="card__brand">${brand}</h3>
        <h2 class="card__name">${name}</h2>
        <p class="product-card__price">${price}</p>
      </a>
    </li>
  `;
}

async function renderList() {
  const listEl = document.querySelector(".product-list");
  if (!listEl) return;

  const data = new ProductData("tents");
  const products = await data.getData();

  const items = Array.isArray(products) ? products
    : Array.isArray(products.Result) ? products.Result
      : [];

  listEl.innerHTML = items.map(productCardTemplate).join("");
}

document.addEventListener("DOMContentLoaded", renderList);