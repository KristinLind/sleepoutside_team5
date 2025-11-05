import { getLocalStorage, setLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // 1) fetch product
    this.product = await this.dataSource.findProductById(this.productId);
    if (!this.product) {
      this.renderError(`No product found for id "${this.productId}"`);
      return;
    }

    // 2) render into the page
    this.renderProductDetails();

    // 3) add-to-cart handler (bind 'this')
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage('so-cart') || [];
    cartItems.push(this.product); // keep it simple this week
    setLocalStorage('so-cart', cartItems);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }

  renderError(msg) {
    const main = document.getElementById('product-detail') || document.querySelector('main');
    if (main) main.innerHTML = `<p class="product-error">${msg}</p>`;
    console.error(msg);
  }
}
function productDetailsTemplate(product) {
  const brand = product.Brand?.Name ?? product.Brand ?? '';
  const title = product.NameWithoutBrand ?? product.Name ?? '';
  const img = product.Image ?? '';
  const price = product.FinalPrice ?? product.SuggestedRetailPrice ?? product.Price ?? '';
  const color = product.Colors?.[0]?.ColorName ?? product.Color ?? '';
  const descHtml = product.DescriptionHtmlSimple ?? product.Description ?? '';
  // brand/title
  const h3 = document.getElementById('brand');
  const h2 = document.getElementById('title');
  if (h3) h3.textContent = brand;
  if (h2) h2.textContent = title;

  // image
  const productImage = document.getElementById('productImage');
  if (productImage) {
    productImage.src = img;
    productImage.alt = title || brand || 'Product image';
    productImage.loading = 'lazy';
  }

  // price/color/desc
  const priceEl = document.getElementById('productPrice');
  const colorEl = document.getElementById('productColor');
  const descEl = document.getElementById('productDesc');

  if (priceEl) {
    const n = Number(price);
    priceEl.textContent = Number.isFinite(n) ? `$${n.toFixed(2)}` : (price || '');
  }
  if (colorEl) colorEl.textContent = color;
  if (descEl) descEl.innerHTML = descHtml;

  // add-to-cart needs the id
  const btn = document.getElementById('addToCart');
  if (btn) btn.dataset.id = product.Id;
}