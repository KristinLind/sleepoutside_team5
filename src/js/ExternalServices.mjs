// src/js/ExternalServices.mjs
const baseURL = import.meta.env.VITE_SERVER_URL;
// Define the specific checkout endpoint
const CHECKOUT_URL = `${baseURL}checkout`;

function convertToJson(res) {
  if (!res.ok) {
    console.error("HTTP Error Details:", res);
    throw new Error(`HTTP ${res.status} fetching ${res.url}`);
  }
  return res.json();
}

export default class ExternalServices {
  constructor(category) {
    this.category = category;
    this.path = `/json/${this.category}.json`; 
  }

  // Fetch products by category from API
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result; 
  }

  // Find product by ID directly from API
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result; 
  }

  // Checkout method
  async checkout(payload) {
    const options = {
      // Must be a POST request
      method: "POST",
      headers: {
        // Tell the server the body is JSON
        "Content-Type": "application/json",
      },
      // The payload must be stringified JSON
      body: JSON.stringify(payload),
    };

    const response = await fetch(CHECKOUT_URL, options);
    const data = await convertToJson(response);
    return data;
  }
}

