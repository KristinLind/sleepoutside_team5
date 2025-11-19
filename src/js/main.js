
import ProductData from './ProductData.mjs';
import ProductList from './productList.mjs';

const dataSource = new ProductData('tents');

// /src/js/main.js
import ExternalServices from "./ExternalServices.mjs";
import { updateCartCount } from "./cartCount.mjs";
import { normalizePublicImage, loadHeaderFooter } from "./utils.mjs";
import Alert from "./Alert.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();

  const alertInstance = new Alert();
  alertInstance.init();

  updateCartCount();
  loadTopProducts();
});

window.addEventListener("storage", updateCartCount);

async function loadTopProducts() {
  const list = document.querySelector(".product-list");
  if (!list) return;

  try {
    const dataSource = new ExternalServices();
    const products = await dataSource.getData("tents");

    const wantedIds = ["880RR", "985RF", "985PR", "344YJ"];
    let display = wantedIds
      .map(id => products.find(p => p.Id === id))
      .filter(Boolean);

    if (display.length < 4) {
      const extras = products.filter(p => !wantedIds.includes(p.Id));
      display = [...display, ...extras.slice(0, 4 - display.length)];
    }

    list.innerHTML = display
      .map(p => productCardTemplate(p, "tents"))
      .join("");
  } catch (err) {
    console.error("Error loading top products:", err);
    list.innerHTML = "<li>Failed to load products.</li>";
  }
}


function productCardTemplate(p, category = "tents") {
  const brand = p.Brand?.Name ?? "";
  const name = p.NameWithoutBrand ?? p.Name ?? "";

  const final = Number(p.FinalPrice);
  const retail = Number(p.SuggestedRetailPrice);
  const isDiscounted = final < retail && retail > 0;
  const discountPercent = isDiscounted
    ? Math.round(((retail - final) / retail) * 100)
    : 0;

  const price = `$${final.toFixed(2)}`;

  const href = `/product_pages/index.html?product=${encodeURIComponent(
    p.Id
  )}&category=${encodeURIComponent(category)}`;

  const imagePath =
    p.Images?.PrimaryMedium ||
    p.Images?.PrimaryLarge ||
    p.Image;

  const imgSrc = normalizePublicImage(imagePath);
  const fallback = normalizePublicImage("images/tents/placeholder-320.jpg");

  return `
    <li class="product-card">
      <a href="${href}">
        <img
          src="${imgSrc}"
          alt="${name}"
          loading="lazy"
          onerror="this.onerror=null;this.src='${fallback}'"
        >
        <h3 class="card__brand">${brand}</h3>
        <h2 class="card__name">${name}</h2>
        <p class="product-card__price">
          ${price}
          ${isDiscounted
      ? `<span class="original-price">$${retail.toFixed(2)}</span>`
      : ""
    }
        </p>
        ${isDiscounted
      ? `<span class="discount-badge">Save ${discountPercent}%</span>`
      : ""
    }
      </a>
    </li>
  `;
}



