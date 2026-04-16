import type { Cart, CartItem, Category, Product } from "@prisma/client";

type CartWithItems = Cart & {
  items: Array<
    CartItem & {
      product: Product & {
        category: Category;
      };
    }
  >;
};

export function serializeCart(cart: CartWithItems) {
  const items = cart.items.map((item) => {
    const lineTotal = item.quantity * item.product.price;

    return {
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      lineTotal,
      product: {
        id: item.product.id,
        name: item.product.name,
        description: item.product.description,
        image: item.product.image,
        price: item.product.price,
        inventoryCount: item.product.inventoryCount,
        category: item.product.category.name
      }
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    id: cart.id,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    total: subtotal,
    items
  };
}
