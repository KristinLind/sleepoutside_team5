// src/js/ProductData.mjs

const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${res.url}`);
  return res.json();
}

export default class Productist {
  constructor(category) {
    this.category = category;
    this.path = `/json/${this.category}.json`; 
  }

  // ✅ Fetch products by category from API
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result; // API wraps results differently than local JSON
  }

  // ✅ Find product by ID directly from API
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result; // check API shape; may be data.Product or data.Result
  }
}
