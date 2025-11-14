// src/js/product-listing.js

console.log("Product listing page loaded");




//new week 3 
import ProductData from "./ProductData.mjs";
import { updateCartCount } from "./cartCount.mjs";
import { normalizePublicImage, loadHeaderFooter } from "./utils.mjs";
import Alert from "./Alert.js";

loadHeaderFooter();
const alertInstance = new Alert();
alertInstance.init();

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  loadProducts();
});
window.addEventListener("storage", updateCartCount);

async function loadProducts() {
  const list = document.querySelector(".product-list");
  if (!list) return;

  const params = new URLSearchParams(window.location.search);
  const category = params.get("category") || "tents";

  try {
    const dataSource = new ProductData(category);
    const products = await dataSource.getData();

    // ✅ Add the guard here
    if (!products || products.length === 0) {
      list.innerHTML = `<li>No products found for "${category}".</li>`;
      return; // stop here so filter/map doesn’t run
    }

    const display = products
      .filter(p => !!(p.Image || p.Images?.PrimaryLarge)) // handle both formats
      .map(productCardTemplate)
      .join("");

    list.innerHTML = display;
  } catch (err) {
    console.error("Error loading products:", err);
    list.innerHTML = "<li>Failed to load products.</li>";
  }
}


function productCardTemplate(p) {
  const final = Number(p.FinalPrice);
  const retail = Number(p.SuggestedRetailPrice);
  const isDiscounted = final < retail;
  const discountPercent = isDiscounted
    ? Math.round(((retail - final) / retail) * 100)
    : 0;

  const price = `$${final.toFixed(2)}`;
  const productHref = `../product_pages/index.html?product=${p.Id}`;

  // pick image: prefer p.Image, fallback to p.Images.PrimaryLarge
  const imgSrc = normalizePublicImage(p.Image || p.Images?.PrimaryLarge);
  const fallback = normalizePublicImage("images/tents/placeholder-320.jpg");

  return `
    <li class="product-card">
      <a href="${productHref}">
        <img src="${imgSrc}" alt="${p.NameWithoutBrand || p.Name}"
             onerror="this.onerror=null;this.src='${fallback}'">
        <h3 class="card__brand">${p.Brand?.Name ?? ""}</h3>
        <h2 class="card__name">${p.NameWithoutBrand || p.Name}</h2>
        <p class="product-card__price">
          ${price}
          ${isDiscounted ? `<span class="original-price">$${retail.toFixed(2)}</span>` : ""}
        </p>
        ${isDiscounted ? `<span class="discount-badge">Save ${discountPercent}%</span>` : ""}
      </a>
    </li>
  `;
}



