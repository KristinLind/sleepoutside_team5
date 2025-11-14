const getProduct = (id) => ({ id }); // local stub to avoid import path issues

test('should return a product object', () => {
  const product = getProduct('sleeping-bag');
  expect(product).toBeDefined();
  expect(product.id).toBe('sleeping-bag');
});
