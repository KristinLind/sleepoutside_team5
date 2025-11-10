// /src/js/ProductData.mjs
function convertToJson(res) {
  if (res.ok) return res.json();
  throw new Error("Bad Response");
}

export default class ProductData {
  constructor(category = "tents") {
    this.category = category;
    this.path = new URL(`../json/${this.category}.json`, import.meta.url).href;
  }

  getData() {
    return fetch(this.path).then(convertToJson);
  }

  async findProductById(id) {
    const products = await this.getData();
    return products.find(p => String(p.Id) === String(id));
  }
}

