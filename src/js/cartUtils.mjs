// src/js/cartUtils.mjs
export function normalizeCartItems(cartItems = []) {
  return cartItems.map(item => ({
    ...item,
    Qty: Number(item.Qty || item.qty || 1),
    Price: Number(item.Price ?? item.FinalPrice ?? item.ListPrice ?? 0)
  }));
}
