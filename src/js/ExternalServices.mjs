// src/js/ExternalServices.mjs

const baseURL = import.meta.env.VITE_SERVER_URL;
// Define the specific checkout endpoint
const CHECKOUT_URL = `${baseURL}checkout`;

async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (!res.ok) {
    console.error(`HTTP Error: ${res.status} ${res.statusText}`, jsonResponse);
    throw {
      name: 'servicesError',
      message: jsonResponse.message || 'Unknown error occurred',
      details: jsonResponse
    };
  }
  return jsonResponse;
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
    // NOTE: This is a publicly shared API for a school project.

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZmZiZjkxOTQ0NWY1MDAwNDkyZDUzOSIsImlhdCI6MTYyNzQxNzk3M30.4rT3y0fR-v1y3D-f3c5q-t4S-k23H-sX50352Y8W3gY";
    const options = {
      // Must be a POST request
      method: "POST",
      headers: {
        // Tell the server the body is JSON
        "Content-Type": "application/json",

        // Add this authorization header;
        "Authorization": `Bearer ${token}`
      },
      // The payload must be stringified JSON
      body: JSON.stringify(payload),
    };

    const response = await fetch(CHECKOUT_URL, options);
    const data = await convertToJson(response);
    return data;
  }
}


