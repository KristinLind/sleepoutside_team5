// src/js/ProductData.mjs

const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${res.url}`);
  return res.json();
}

export default class ProductData {
  constructor() {
    // no category or path stored here anymore
  }

  // ✅ Fetch products by category from API
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result; // API wraps results differently than local JSON
  }

  // ✅ Find product by ID using API data
  async findProductById(id, category) {
    const products = await this.getData(category);
    return products.find(item => String(item.Id) === String(id));
  }
}
 




