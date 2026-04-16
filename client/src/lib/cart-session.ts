const CART_STORAGE_KEY = "shopstack-cart-id";

export function getCartId() {
  return window.localStorage.getItem(CART_STORAGE_KEY);
}

export function setCartId(cartId: string) {
  window.localStorage.setItem(CART_STORAGE_KEY, cartId);
}
