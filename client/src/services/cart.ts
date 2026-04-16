import { apiRequest, type Cart } from "./api";

export function getCart() {
  return apiRequest<Cart>("/cart");
}

export function addToCart(productId: string, quantity: number) {
  return apiRequest<Cart>("/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId, quantity })
  });
}

export function updateCartItem(productId: string, quantity: number) {
  return apiRequest<Cart>(`/cart/items/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity })
  });
}

export function removeCartItem(productId: string) {
  return apiRequest<Cart>(`/cart/items/${productId}`, {
    method: "DELETE"
  });
}
