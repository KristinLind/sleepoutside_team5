// src/js/cartUtils.mjs
export function normalizeCartItems(cartItems = []) {
  return cartItems.map(item => ({
    id: item.Id || item.id,
    name: item.Name || item.NameWithoutBrand || item.name,
    price: Number(item.Price ?? item.FinalPrice ?? item.ListPrice ?? item.price ?? 0),
    qty: Number(item.Qty ?? item.qty ?? 1),
    image:
      // ✅ Handle all JSON variations
      item.Image ||
      item.PrimaryMedium ||
      item.PrimaryLarge ||
      item.PrimaryExtraLarge ||
      item.Images?.PrimaryLarge ||
      item.Images?.PrimaryMedium ||
      item.Images?.PrimarySmall ||
      item.ColorPreviewImageSrc ||
      (item.Images?.ExtraImages?.[0]?.Src) || // first extra image fallback
      ""
  }));
}
