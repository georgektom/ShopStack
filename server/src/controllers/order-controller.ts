import type { Request, Response } from "express";
import { createOrderFromCart } from "../services/order-service.js";
import { getCartIdFromCookie } from "../utils/cart-cookie.js";

export async function createOrder(request: Request, response: Response) {
  const order = await createOrderFromCart({
    customerName: request.body.customerName,
    customerEmail: request.body.customerEmail,
    addressLine1: request.body.addressLine1,
    addressLine2: request.body.addressLine2,
    city: request.body.city,
    state: request.body.state,
    postalCode: request.body.postalCode,
    shippingMethod: request.body.shippingMethod,
    paymentCardholderName: request.body.paymentCardholderName,
    paymentCardNumber: request.body.paymentCardNumber,
    paymentExpiryMonth: Number(request.body.paymentExpiryMonth),
    paymentExpiryYear: Number(request.body.paymentExpiryYear),
    cartId: getCartIdFromCookie(request)
  });

  return response.status(201).json({ data: order });
}
