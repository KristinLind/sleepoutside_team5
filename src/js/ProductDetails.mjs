// src/js/ProductDetails.mjs
import { getLocalStorage, setLocalStorage, normalizePublicImage, alertMessage } from "./utils.mjs";
import { updateCartCount } from "./cartCount.mjs";

const CART_KEY = "so-cart";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    try {
      this.product = await this.dataSource.findProductById(this.productId);
      this.renderProductDetails();
      document
        .getElementById("addToCart")
        .addEventListener("click", this.addProductToCart.bind(this));
    } catch (err) {
      console.error("Error loading product details:", err);
    }
  }

  addProductToCart() {
    const cart = getLocalStorage(CART_KEY) || [];

    const item = {
      Id: this.product.Id,
      Name: this.product.Name,
      Price:
        this.product.FinalPrice ??
        this.product.Price ??
        this.product.ListPrice ??
        0,

      Image:
        this.product.Images?.PrimaryMedium ||
        this.product.Images?.PrimaryLarge ||
        this.product.Image ||
        "",

      Images: this.product.Images ?? {},
      Color: this.product?.Colors?.[0]?.ColorName ?? "",
      Qty: 1,
    };

    // merge with existing cart
    const idx = cart.findIndex((p) => String(p.Id) === String(item.Id));
    if (idx >= 0) {
      cart[idx].Qty = (cart[idx].Qty || 1) + 1;
    } else {
      cart.push(item);
    }

    setLocalStorage(CART_KEY, cart);
    updateCartCount();

    // ✅ Show feedback
    alertMessage(`${item.Name} was added to your cart!`);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  document.getElementById("brand").textContent = product.Brand?.Name ?? "";
  document.getElementById("title").textContent =
    product.NameWithoutBrand || product.Name || "";

  const img = document.getElementById("productImage");
  img.src = normalizePublicImage(
    product.Images?.PrimaryLarge || product.Image || ""
  );
  img.alt = product.NameWithoutBrand || product.Name || "";

  document.getElementById("productPrice").textContent = `$${Number(
    product.FinalPrice ?? product.Price ?? 0
  ).toFixed(2)}`;

  document.getElementById("productColor").textContent =
    product?.Colors?.[0]?.ColorName ?? "";

  document.getElementById("productDesc").innerHTML =
    product.DescriptionHtmlSimple ?? "";

  document.getElementById("addToCart").dataset.id = product.Id;
}

