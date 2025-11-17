import ExternalServices from "./ExternalServices.mjs";
import { getParams, normalizePublicImage } from "./utils.mjs";

function productCardTemplate(p) {
  const brand = p.Brand?.Name ?? p.Brand ?? "";
  const name = p.NameWithoutBrand ?? p.Name ?? "";

  // Normalize image path so relative API paths resolve correctly
  const img = normalizePublicImage(p.Image || p.Images?.PrimaryLarge || "");
  const price = Number.isFinite(+p.FinalPrice)
    ? `$${(+p.FinalPrice).toFixed(2)}`
    : (p.FinalPrice ?? p.SuggestedRetailPrice ?? "");

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

  //  Get category from URL instead of hardcoding "tents"
  const category = getParams("category") || "tents";

  try {
    const dataSource = new ExternalServices();
    const products = await dataSource.getData(category);

    if (!products || products.length === 0) {
      listEl.innerHTML = `<li>No products found for "${category}".</li>`;
      return;
    }

    listEl.innerHTML = products.map(productCardTemplate).join("");
  } catch (err) {
    console.error("Error loading products:", err);
    listEl.innerHTML = "<li>Failed to load products.</li>";
  }
}

document.addEventListener("DOMContentLoaded", renderList);
