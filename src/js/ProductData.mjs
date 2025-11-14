// src/js/ProductData.mjs
function convertToJson(res) {
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${res.url}`);
  return res.json();
}

export default class Productist {
  constructor(category) {
    this.category = category;
    this.path = `/json/${this.category}.json`; 
  }

  // added to handel both file types
  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then(data => {
        if (Array.isArray(data)) {
          return data; // tents
        }
        if (Array.isArray(data.Result)) {
          return data.Result; // sleeping-bags, backpacks, hammocks
        }
        console.error("Unexpected data format:", data);
        return [];
      });
  }

  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => String(item.Id) === String(id));
  }
}


 




