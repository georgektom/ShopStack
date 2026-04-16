import { AppError } from "../utils/app-error.js";
import { findCartById } from "../repositories/cart-repository.js";
import { runInTransaction } from "../repositories/order-repository.js";

type CheckoutInput = {
  customerName: string;
  customerEmail: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  cartId?: string;
};

export async function createOrderFromCart(input: CheckoutInput) {
  if (!input.cartId) {
    throw new AppError(400, "CART_REQUIRED", "A cart id is required to place an order.");
  }

  const cart = await findCartById(input.cartId);

  if (!cart || cart.items.length === 0) {
    throw new AppError(400, "EMPTY_CART", "Your cart is empty.");
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

  const order = await runInTransaction(async (transaction) => {
    for (const item of cart.items) {
      const product = await transaction.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        throw new AppError(404, "PRODUCT_NOT_FOUND", "A product in your cart no longer exists.");
      }

      if (item.quantity > product.inventoryCount) {
        throw new AppError(
          400,
          "INSUFFICIENT_INVENTORY",
          `${product.name} does not have enough inventory to complete this order.`,
          { available: product.inventoryCount, requested: item.quantity }
        );
      }

      await transaction.product.update({
        where: { id: product.id },
        data: {
          inventoryCount: {
            decrement: item.quantity
          }
        }
      });
    }

    await transaction.cartItem.deleteMany({
      where: {
        cartId: input.cartId
      }
    });

    return transaction.order.create({
      data: {
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        addressLine1: input.addressLine1,
        addressLine2: input.addressLine2 || null,
        city: input.city,
        state: input.state,
        postalCode: input.postalCode,
        subtotal,
        total: subtotal,
        items: {
          create: cart.items.map((item) => ({
            quantity: item.quantity,
            unitPrice: item.product.price,
            lineTotal: item.quantity * item.product.price,
            productName: item.product.name,
            productImage: item.product.image,
            productId: item.productId
          }))
        }
      },
      include: {
        items: true
      }
    });
  });

  return {
    id: order.id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    addressLine1: order.addressLine1,
    addressLine2: order.addressLine2,
    city: order.city,
    state: order.state,
    postalCode: order.postalCode,
    status: order.status,
    subtotal: order.subtotal,
    total: order.total,
    createdAt: order.createdAt,
    items: order.items
  };
}
