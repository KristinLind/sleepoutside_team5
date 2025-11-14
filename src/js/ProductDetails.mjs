// src/js/ProductDetails.mjs
import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { updateCartCount } from "./cartCount.mjs";

const CART_KEY = "so-cart";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document.getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cart = getLocalStorage(CART_KEY) || [];

    const item = {
      Id: this.product.Id,
      Name: this.product.Name,
      Price: this.product.FinalPrice ?? this.product.Price ?? 0,
      Image: String(this.product.Image || "").replace(/^\/+/, ""),
    
      Color: this.product?.Colors?.[0]?.ColorName ?? "",
      Qty: 1
    };

    const idx = cart.findIndex(p => String(p.Id) === String(item.Id));
    if (idx >= 0) cart[idx].Qty = (cart[idx].Qty || 1) + 1;
    else cart.push(item);

    setLocalStorage(CART_KEY, cart);
    updateCartCount();
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

// ProductDetails.mjs
function productDetailsTemplate(product) {
  document.getElementById("brand").textContent = product.Brand?.Name ?? "";
  document.getElementById("title").textContent = product.NameWithoutBrand ?? "";

  const img = document.getElementById("productImage");
  img.src = product.Image;
  img.alt = product.NameWithoutBrand ?? "";

  document.getElementById("productPrice").textContent =
    `$${product.FinalPrice ?? product.Price ?? 0}`;

  document.getElementById("productColor").textContent =
    product?.Colors?.[0]?.ColorName ?? "";

  document.getElementById("productDesc").innerHTML =
    product.DescriptionHtmlSimple ?? "";

  document.getElementById("addToCart").dataset.id = product.Id;
}




