import { apiRequest, type Order } from "./api";

export function createOrder(input: {
  customerName: string;
  customerEmail: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
}) {
  return apiRequest<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(input)
  });
}
