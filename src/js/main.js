// /src/js/main.js

import ProductData from "./ProductData.mjs";
import { updateCartCount } from "./cartCount.mjs";
import { normalizePublicImage, loadHeaderFooter } from "./utils.mjs";
import Alert from "./Alert.js";

loadHeaderFooter();
const alertInstance = new Alert();
alertInstance.init();

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  loadTopProducts();
});
window.addEventListener("storage", updateCartCount);

async function loadTopProducts() {
  const list = document.querySelector(".product-list");
  if (!list) return;

  try {
    const dataSource = new ProductData();
    const products = await dataSource.getData("tents");

    const wantedIds = ["880RR", "985RF", "985PR", "344YJ"];
    let display = wantedIds
      .map(id => products.find(p => p.Id === id))
      .filter(Boolean);

    // Fallback: fill with extras if fewer than 4 matched
    if (display.length < 4) {
      const extras = products.filter(p => !wantedIds.includes(p.Id));
      display = [...display, ...extras.slice(0, 4 - display.length)];
    }

    list.innerHTML = display.map(productCardTemplate).join("");
  } catch (err) {
    console.error("Error loading top products:", err);
    list.innerHTML = "<li>Failed to load products.</li>";
  }
}

function productCardTemplate(p) {
  const brand = p.Brand?.Name ?? "";
  const name = p.NameWithoutBrand ?? p.Name ?? "";
  const price = Number.isFinite(+p.FinalPrice)
    ? `$${(+p.FinalPrice).toFixed(2)}`
    : (p.FinalPrice ?? "");

  const href = `/product_pages/index.html?product=${encodeURIComponent(p.Id)}`;
  const imgSrc = normalizePublicImage(p.Image || p.Images?.PrimaryLarge || "");
  const fallback = normalizePublicImage("images/tents/placeholder-320.jpg");

  return `
    <li class="product-card">
      <a href="${href}">
        <img src="${imgSrc}" alt="${name}" loading="lazy"
             onerror="this.onerror=null;this.src='${fallback}'">
        <h3 class="card__brand">${brand}</h3>
        <h2 class="card__name">${name}</h2>
        <p class="product-card__price">${price}</p>
      </a>
    </li>
  `;
}

// async function loadProducts() {
//   try {
//     const dataSource = new ProductData("tents");
//     const products = await dataSource.getData();

//     const list = document.querySelector(".product-list");
//     if (!list) return;

//     const wanted = [
//       { brand: "Marmot", name: "Ajax Tent - 3-Person, 3-Season" },
//       { brand: "The North Face", name: "Talus Tent - 4-Person, 3-Season" },
//       { brand: "The North Face", name: "Alpine Guide Tent - 3-Person, 4-Season" },
//       { brand: "Cedar Ridge", name: "Rimrock Tent - 2-Person, 3-Season" }
//     ];

    // 👇 Use normalize when comparing
//     const display = wanted
//       .map(w =>
//         products.find(p =>
//           normalize(p.Brand?.Name) === normalize(w.brand) &&
//           normalize(p.NameWithoutBrand) === normalize(w.name)
//         )
//       )
//       .filter(Boolean);

//     list.innerHTML = display.map(productCardTemplate).join("");
//   } catch (err) {
//     console.error("Error loading products:", err);
//   }
// }
