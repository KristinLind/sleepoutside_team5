import { setLocalStorage } from './utils.mjs';

function formatPrice(value) {
  const n = Number(value);
  return Number.isFinite(n) ? `$${n.toFixed(2)}` : '$—';
}

function normalizeProduct(raw) {
  if (!raw) return null;
  return {
    id: raw.Id ?? raw.id ?? raw.sku,
    brand: raw.Brand ?? raw.brand ?? '',
    name: raw.Name ?? raw.title ?? '',
    image: raw.Image ?? raw.image ?? raw.Images?.[0] ?? '',
    price: raw.FinalPrice ?? raw.SuggestedRetailPrice ?? raw.Price ?? raw.price,
    color: raw.Color ?? raw.color ?? '',
    description: raw.Description ?? raw.description ?? '',
    stock: raw.Stock ?? raw.stock ?? null,
  };
}

function productDetailTemplate(p) {
  return `
    <section class="product-detail">
      ${p.brand ? `<h3>${p.brand}</h3>` : ''}
      <h2 class="divider">${p.name}</h2>
      ${p.image ? `<img class="divider" src="${p.image}" alt="${p.name}" loading="lazy">` : ''}
      <p class="product-card__price">${formatPrice(p.price)}</p>
      ${p.color ? `<p class="product__color">${p.color}</p>` : ''}
      ${p.description ? `<p class="product__description">${p.description}</p>` : ''}
      <div class="product-detail__add">
        <button id="addToCart" data-id="${p.id}">Add to Cart</button>
      </div>
    </section>
  `;
}

export default class ProductDetails {
  constructor(productId, dataSource, cartKey = 'so-cart') {
    this.productId = productId;
    this.dataSource = dataSource;
    this.cartKey = cartKey;
    this.root = document.getElementById('product-detail');
    this.product = null;
    this.raw = null;
  }

  async init() {
    try {
      this.raw = await this.dataSource.findProductById(this.productId);
      if (!this.raw) {
        this.renderError(`No product found for id "${this.productId}".`);
        return;
      }
      this.product = normalizeProduct(this.raw);
      this.renderProductDetails();

      const btn = document.getElementById('addToCart');
      if (btn) btn.addEventListener('click', this.addProductToCart.bind(this));
    } catch (err) {
      console.error(err);
      this.renderError('There was a problem loading this product.');
    }
  }

  addProductToCart() {
    const cart = JSON.parse(localStorage.getItem(this.cartKey) || '[]');
    cart.push({
      Id: this.product.id,
      Name: this.product.name,
      Brand: this.product.brand,
      Image: this.product.image,
      FinalPrice: this.product.price,
    });
    setLocalStorage(this.cartKey, cart);

    const btn = document.getElementById('addToCart');
    if (btn) {
      const old = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Added!';
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = old;
      }, 1000);
    }
  }

  renderProductDetails() {
    this.root.innerHTML = productDetailTemplate(this.product);
  }

  renderError(message) {
    this.root.innerHTML = `
      <div class="product-error">
        <p>${message}</p>
        <p><a href="../index.html">Back to products</a></p>
      </div>
    `;
  }
}
