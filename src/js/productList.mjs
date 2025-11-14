export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    // Get product data from the data source
    const list = await this.dataSource.getData();
    // Once we have the data, render it to the page
    this.renderList(list);
  }

  renderList(list) {
    // Clear any existing content
    this.listElement.innerHTML = '';

    // Loop through each product and create HTML cards
    list.forEach(product => {
      this.listElement.appendChild(this.renderProductCard(product));
    });
  }

  renderProductCard(product) {
    const item = document.createElement('div');
    item.classList.add('product-card');

    item.innerHTML = `
      <h3>${product.Name}</h3>
      <p>${product.Description}</p>
      <p><strong>Price:</strong> $${product.FinalPrice}</p>
      <img src="${product.Image}" alt="${product.Name}">
    `;

    return item;
  }
}
