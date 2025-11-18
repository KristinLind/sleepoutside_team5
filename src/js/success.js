if (!lastOrder || !lastOrder.orderTotal) {
  section.innerHTML = `
    <h2>No order found</h2>
    <p>Please return to the store and try again.</p>
    <p><a href="/">Continue Shopping</a></p>
  `;
  return;
}

section.innerHTML = `
  <h2>Order Placed Successfully!</h2>
  <p>Thank you, ${lastOrder.fname} ${lastOrder.lname}.</p>
  <p>Order Date: ${new Date().toLocaleString()}</p>
  <p>Subtotal: $${(lastOrder.orderTotal - lastOrder.tax - lastOrder.shipping).toFixed(2)}</p>
  <p>Tax: $${lastOrder.tax.toFixed(2)}</p>
  <p>Shipping: $${lastOrder.shipping.toFixed(2)}</p>
  <p><strong>Total: $${lastOrder.orderTotal.toFixed(2)}</strong></p>
  <p><a href="/">Continue Shopping</a></p>
`;
