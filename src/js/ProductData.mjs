// src/js/ProductData.mjs
function convertToJson(res) {
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${res.url}`);
  return res.json();
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    this.path = `/json/${this.category}.json`; 
  }

  getData() {
    return fetch(this.path).then(convertToJson);
  }

  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => String(item.Id) === String(id));
  }
}




