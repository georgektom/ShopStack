import type { Request, Response } from "express";
import { getSessionUser } from "../services/auth-service.js";
import { createOrderFromCart } from "../services/order-service.js";
import { getAuthTokenFromCookie } from "../utils/auth-cookie.js";
import { getCartIdFromCookie } from "../utils/cart-cookie.js";

export async function createOrder(request: Request, response: Response) {
  const sessionUser = await getSessionUser(getAuthTokenFromCookie(request));
  const order = await createOrderFromCart({
    userId: sessionUser?.id ?? null,
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
