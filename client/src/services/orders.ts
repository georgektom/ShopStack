import { apiRequest, type Order } from "./api";

export function createOrder(input: {
  customerName: string;
  customerEmail: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  shippingMethod: "standard" | "express" | "overnight";
  paymentCardholderName: string;
  paymentCardNumber: string;
  paymentExpiryMonth: number;
  paymentExpiryYear: number;
}) {
  return apiRequest<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(input)
  });
}
